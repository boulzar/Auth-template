import {
	ApolloClient,
	ApolloLink,
	HttpLink,
	InMemoryCache,
	Observable,
} from '@apollo/client';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { withApollo } from 'next-apollo';
import { getAccessToken, setAccessToken } from './accessToken';
import { onError } from '@apollo/client/link/error';

const requestLink = new ApolloLink(
	(operation, forward) =>
		new Observable((observer) => {
			let handle: any;
			Promise.resolve(operation)
				.then((operation) => {
					const accessToken = getAccessToken();
					if (accessToken) {
						operation.setContext({
							headers: {
								authorization: `bearer ${accessToken}`,
							},
						});
					}
				})
				.then(() => {
					handle = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});
				})
				// .catch(observer.error.bind(observer));
				.catch((err) => {
					console.log(err);
				});

			return () => {
				if (handle) handle.unsubscribe();
			};
		})
);

const apolloClient = new ApolloClient({
	link: ApolloLink.from([
		new TokenRefreshLink({
			accessTokenField: 'accessToken',
			isTokenValidOrUndefined: () => {
				const token = getAccessToken();

				if (!token) {
					return true;
				}

				try {
					const { exp } = jwtDecode<JwtPayload>(token);
					if (Date.now() >= exp! * 1000) {
						return false;
					} else {
						return true;
					}
				} catch {
					return false;
				}
			},
			fetchAccessToken: () => {
				return fetch('http://localhost:4000/refresh_token', {
					method: 'POST',
					credentials: 'include',
				});
			},
			handleFetch: (accessToken) => {
				setAccessToken(accessToken);
			},
			handleError: (err) => {
				console.warn('Your refresh token is invalid. Try to relogin');
				console.error(err);
			},
		}),
		onError(({ graphQLErrors, networkError, operation }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path }) => {
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					);
					return Observable.of(operation);
				});
			} else if (networkError) {
				console.log(`[Network error]: ${networkError}`);
				return Observable.of(operation);
			}

			return Observable.of(operation);
		}),
		requestLink,
		new HttpLink({
			uri: 'http://localhost:4000/graphql',
			credentials: 'include',
		}),
	]),
	cache: new InMemoryCache(),
});

export default withApollo(apolloClient);
