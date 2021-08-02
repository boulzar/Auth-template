import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import React from 'react';

interface NavLinkProps {
	path: string;
	hasSubmenu?: boolean;
	exact?: boolean;
}
export const NavLink: React.FC<
	NavLinkProps & React.HTMLProps<HTMLAnchorElement>
> = ({ path, exact, children, hasSubmenu, className, ...props }) => {
	const router = useRouter();

	const isActive = exact
		? router.pathname === path
		: router.pathname.startsWith(path);

	if (hasSubmenu) {
		return (
			<a
				className={
					isActive
						? `text-white font-semibold ${className}`
						: `text-gray-200 hover:text-gray-50 ${className}`
				}
				{...props}
			>
				{children}
			</a>
		);
	}

	return (
		<Link href={path}>
			<a
				className={
					isActive
						? 'text-white font-semibold'
						: 'text-gray-200 hover:text-gray-50'
				}
				{...props}
			>
				{children}
			</a>
		</Link>
	);
};

NavLink.defaultProps = {
	exact: true,
	hasSubmenu: false,
};
