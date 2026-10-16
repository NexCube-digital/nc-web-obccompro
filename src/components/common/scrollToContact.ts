export function scrollToContact() {
	const contactFooter = document.getElementById('kontak')
	if (!contactFooter) return false

	contactFooter.scrollIntoView({ behavior: 'smooth', block: 'start' })
	return true
}