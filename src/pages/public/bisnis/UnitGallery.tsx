import { useState } from 'react'
import LazySection from '../../../components/common/LazySectionHome'
import ScrollReveal from '../../../components/animation/ScrollReveal'
import ImageLightbox from '../../../components/ui/modal/ImageLightbox'

type GalleryVariant = 'guest-house' | 'agribisnis' | 'villa'

interface UnitGalleryProps {
	images: string[]
	unitName: string
	badge: string
	title: string
	variant?: GalleryVariant
}

function UnitGallery({ images, unitName, badge, title, variant }: UnitGalleryProps) {
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const hasCompactHeader = variant === 'guest-house' || variant === 'villa'

	return (
		<>
			<LazySection minHeight={600}>
				<section className={`mx-auto max-w-[1200px] ${hasCompactHeader ? 'px-6 pb-10 md:px-8 md:pb-16' : 'px-5 pb-16 md:px-8'}`}>
					<ScrollReveal>
						<div className="text-center">
							<span className={`font-['Montserrat'] text-[16px] font-semibold leading-[20px] tracking-[1.4px] text-black ${hasCompactHeader ? 'normal-case md:uppercase' : 'uppercase'}`}>
								{badge}
							</span>
							<h2 className="mt-2 font-['Montserrat'] text-[20px] font-semibold leading-[28px] tracking-[-0.5px] text-black">
								{title}
							</h2>
							<div className={`mx-auto mt-3 h-[2px] rounded-[2px] bg-[#0000004D] ${hasCompactHeader ? 'hidden w-[396px] max-w-full md:block' : variant === 'agribisnis' ? 'w-full max-w-[396px]' : 'w-[396px] max-w-full'}`} />
						</div>
					</ScrollReveal>

					<div className={`mt-6 grid grid-cols-2 gap-[10px] md:mt-8 md:grid-cols-4 md:gap-3 ${variant === 'agribisnis' ? 'w-full min-w-0' : ''}`}>
						{images.slice(0, 8).map((image, index) => {
							const imagePosition =
								variant === 'agribisnis' && index === 3
									? 'object-left'
									: variant === 'villa' && index === 0
										? 'object-[75%_center]'
										: variant === 'villa' && index === 5
											? 'object-right'
											: 'object-center'

							return (
								<ScrollReveal
									key={`${image}-${index}`}
									className={`aspect-[4/3] w-full md:aspect-[280/296] ${
										index >= 4 ? 'hidden md:block' : ''
									} ${variant === 'agribisnis' ? 'min-w-0' : ''}`}
									delay={index * 90}
									duration={700}
									distance={16}
									scale={0.98}
								>
									<button
										type="button"
										onClick={() => setSelectedImage(image)}
										className={`group h-full w-full overflow-hidden rounded-[20px] md:rounded-xl ${variant === 'agribisnis' ? 'min-w-0' : ''}`}
										aria-label={`Buka gambar Momen ${unitName} ${index + 1}`}
									>
										<img
											src={image}
											alt={`Momen ${unitName} ${index + 1}`}
											loading="lazy"
											decoding="async"
											className={`h-full w-full ${imagePosition} object-cover transition-transform duration-500 group-hover:scale-105`}
										/>
									</button>
								</ScrollReveal>
							)
						})}
					</div>
				</section>
			</LazySection>

			{selectedImage && (
				<ImageLightbox
					src={selectedImage}
					alt={`Pratinjau galeri ${unitName}`}
					onClose={() => setSelectedImage(null)}
				/>
			)}
		</>
	)
}

export default UnitGallery
