import { useRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import {
	useHref,
	useLocation,
	useNavigate,
	useResolvedPath,
	type NavigateFunction,
	type NavigateOptions,
	type To,
} from 'react-router-dom'
import { preloadRoute } from '../../routes/AppRoutes'

type ActiveState = { isActive: boolean; isPending: false }

type TransitionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> & {
	to: To
	className?: string | ((state: ActiveState) => string)
	end?: boolean
	replace?: boolean
	state?: NavigateOptions['state']
}

function normalizePath(pathname: string) {
	return pathname.replace(/\/+$/, '').toLowerCase() || '/'
}

export async function navigateWithTransition(
	to: To,
	navigate: NavigateFunction,
	options?: NavigateOptions,
) {
	const pathname = typeof to === 'string' ? to : to.pathname ?? '/'
	try {
		await preloadRoute(pathname)
	} catch {
		// Navigasi tetap berjalan jika chunk gagal dipreload.
	}

	navigate(to, options)
}

export default function TransitionLink({
	to,
	className,
	end = false,
	replace = false,
	state,
	onClick,
	onMouseEnter,
	onFocus,
	onTouchStart,
	target,
	download,
	...anchorProps
}: TransitionLinkProps) {
	const navigate = useNavigate()
	const location = useLocation()
	const resolvedPath = useResolvedPath(to)
	const href = useHref(to)
	const pending = useRef(false)
	const targetPath = normalizePath(resolvedPath.pathname)
	const currentPath = normalizePath(location.pathname)
	const isActive = end
		? currentPath === targetPath
		: currentPath === targetPath || currentPath.startsWith(`${targetPath}/`)
	const resolvedClassName = typeof className === 'function'
		? className({ isActive, isPending: false })
		: className

	const preload = () => {
		void preloadRoute(resolvedPath.pathname).catch(() => undefined)
	}

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event)
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey ||
			(target && target !== '_self') ||
			download !== undefined
		) return

		event.preventDefault()
		const options: NavigateOptions = { replace, state }
		if (currentPath === targetPath) {
			navigate(to, options)
			if (!resolvedPath.hash) {
				window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
			}
			return
		}
		if (pending.current) return

		pending.current = true
		void navigateWithTransition(to, navigate, options).finally(() => {
			pending.current = false
		})
	}

	return (
		<a
			{...anchorProps}
			href={href}
			target={target}
			download={download}
			className={resolvedClassName}
			aria-current={anchorProps['aria-current'] ?? (isActive ? 'page' : undefined)}
			onMouseEnter={(event) => {
				onMouseEnter?.(event)
				preload()
			}}
			onFocus={(event) => {
				onFocus?.(event)
				preload()
			}}
			onTouchStart={(event) => {
				onTouchStart?.(event)
				preload()
			}}
			onClick={handleClick}
		/>
	)
}