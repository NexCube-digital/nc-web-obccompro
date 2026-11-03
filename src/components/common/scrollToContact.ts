export function scrollToContact() {
	const contactFooter = document.getElementById('kontak')
	if (!contactFooter) return false

	const alignFooter = () => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: 'instant',
		})
	}
	let fallbackTimer = 0
	const handleScrollEnd = () => {
		window.clearTimeout(fallbackTimer)
		window.requestAnimationFrame(() => window.requestAnimationFrame(alignFooter))
	}

	contactFooter.scrollIntoView({ behavior: 'smooth', block: 'end' })
	document.addEventListener('scrollend', handleScrollEnd, { once: true })
	fallbackTimer = window.setTimeout(() => {
		document.removeEventListener('scrollend', handleScrollEnd)
		alignFooter()
	}, 800)
	return true
}