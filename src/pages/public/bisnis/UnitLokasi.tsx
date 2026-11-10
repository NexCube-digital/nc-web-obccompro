import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LazySection from '../../../components/common/LazySectionHome'
import ScrollReveal from '../../../components/animation/ScrollReveal'

interface UnitLokasiProps {
	title: string
	address: string
	mapLabel: string
	latitude: number
	longitude: number
	variant?: 'agribisnis'
}

function UnitLokasi({ title, address, mapLabel, latitude, longitude, variant }: UnitLokasiProps) {
	const { t } = useTranslation()
	const mapQuery = `${latitude},${longitude} (${mapLabel})`
	const mapUrl = `https://www.google.com/maps?${new URLSearchParams({ q: mapQuery })}`
	const embedUrl = `https://www.google.com/maps?${new URLSearchParams({
		q: mapQuery,
		hl: 'id',
		z: '17',
		output: 'embed',
	})}`
	const isAgribisnis = variant === 'agribisnis'

	return (
		<LazySection minHeight={500}>
			<ScrollReveal>
				<section className="mx-auto flex max-w-[1200px] flex-col px-6 pb-10 md:block md:px-8 md:pb-16">
					<div className="contents md:flex md:flex-wrap md:items-center md:justify-between md:gap-3">
						<div className={`order-1 md:order-none ${isAgribisnis ? 'min-w-0' : ''}`}>
							<h2 className={`h-auto w-full max-w-none font-['Montserrat'] text-[20px] font-semibold leading-[100%] tracking-[0%] text-black md:text-[25px] ${isAgribisnis ? 'md:min-h-[30px]' : ''}`}>
								{title}
							</h2>
							<p className={`mt-3 h-auto w-full max-w-[845px] font-['Montserrat'] text-[14px] font-normal leading-[24px] tracking-[0.15px] text-black md:mt-1 md:text-[15px] ${isAgribisnis ? 'md:min-h-[24px]' : ''}`}>
								{address}
							</p>
						</div>
						<a
							href={mapUrl}
							target="_blank"
							rel="noreferrer"
							className={`order-3 mt-4 inline-flex h-[40px] w-full items-center justify-center gap-[8px] rounded-full bg-[#E9E9E9] px-[20px] py-[12px] font-['Montserrat'] text-[16px] font-semibold leading-[19.6px] tracking-[0.56px] text-[#222022] hover:bg-[#E1E1E1] md:order-none md:mt-0 md:h-[32px] md:w-[229px] md:text-[14px] ${isAgribisnis ? 'shrink-0' : 'md:shrink-0'}`}>
							<ExternalLink className="h-[16px] w-[16px] text-[#222022] md:h-[13.5px] md:w-[13.5px]" />
							{t('common.openGoogleMaps')}
						</a>
					</div>

					<div className={`order-2 mt-4 h-[300px] overflow-hidden rounded-[24px] border border-obc-border md:order-none md:mt-6 md:rounded-2xl ${isAgribisnis ? 'md:h-[420px]' : 'md:h-[380px] lg:h-[420px]'}`}>
						<iframe
							title={title}
							src={embedUrl}
							className="h-full w-full border-0"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</div>
				</section>
			</ScrollReveal>
		</LazySection>
	)
}

export default UnitLokasi
