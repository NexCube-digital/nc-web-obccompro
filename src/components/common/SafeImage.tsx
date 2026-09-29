import { useState, type ImgHTMLAttributes } from 'react'

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
	src: string
	fallbackSeed?: string
}


function SafeImage({ src, fallbackSeed, alt, className, ...rest }: SafeImageProps) {
	const [currentSrc, setCurrentSrc] = useState(src)

	return (
		<img
			src={currentSrc}
			alt={alt}
			className={className}
			loading="lazy"
			onError={() => {
				setCurrentSrc(`https://picsum.photos/seed/${fallbackSeed ?? alt ?? 'obc'}/1200/900`)
			}}
			{...rest}
		/>
	)
}

export default SafeImage