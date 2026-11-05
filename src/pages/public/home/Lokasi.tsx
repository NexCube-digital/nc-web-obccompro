import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Minus, LocateFixed } from 'lucide-react'
import locationIcon from '../../../assets/icon/iconstack.io - (Location 05).svg'
import locationArrowIcon from '../../../assets/icon/iconstack.io - (Square Rounded Arrow Right).svg'

const locationCategories = ['all', 'accommodation', 'sport', 'fnb', 'lifestyle', 'education'] as const

const locations = [
	{
		id: 'rancabentang-3a-guesthouse',
		address: 'Jl. Rancabentang, No. 3A',
		category: 'accommodation',
		lat: -6.874237184358439,
		lng: 107.60757312883369,
		units: ['OBC Guest House & Penthouse'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		id: 'rancabentang-10-villa',
		address: 'Jl. Rancabentang, No. 10',
		category: 'accommodation',
		lat: -6.874537072865878, 
		lng: 107.6069089060377,
		units: ['OBC Villa'],
		info: ['Check-in 14.00 WIB', 'Check-out 12.00 WIB'],
	},
	{
		id: 'rancabentang-3a-sport',
		address: 'Jl. Rancabentang, No. 3A',
		category: 'sport',
		lat: -6.874663909611867, 
		lng: 107.60723113689546,
		units: ['OBC Sports Center', 'OBC Food Court', 'OBC Coffee', 'OBC Laundry'],
		info: [
			'Sport | Setiap hari 07.00 WIB - 00.00 WIB',
			'Coffee | Setiap hari 08.00 WIB - 22.00 WIB',
		],
	},
	{
		id: 'tugulaksana-agribisnis',
		address: 'Jl. Tugulaksana, Wangunsari',
		category: 'education',
		lat: -6.842528468240614,
		lng: 107.61717356691328,
		units: ['OBC Agribisnis'],
		info: ['Kebun & Edukasi Pertanian'],
	},
	{
		id: 'tugulaksana-soccer-academy',
		address: 'Jl. Tugulaksana, Wangunsari',
		category: 'sport',
		lat: -6.842765050775239,
		lng: 107.61677761879807,
		units: ['OBC Soccer Academy'],
		info: ['Soccer Academy'],
	},
]

type Location = (typeof locations)[number]

const GEOTAG_MAP_HTML = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif; background: #e6e9f0; }
  .leaflet-control-attribution { font-size: 10px; background: rgba(255,255,255,0.75) !important; }
  .obc-pin-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer; }
  .obc-pin-badge {
    margin-bottom: 4px;
    white-space: nowrap;
    background: #1F3320;
    color: #FFFFFF;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 999px;
    border: 1.5px solid #CDF178;
    box-shadow: 0 2px 8px rgba(0,0,0,0.28);
    line-height: 1.2;
  }
  .obc-pin-badge span { color: #CDF178; font-weight: 600; }
  .obc-pin-svg { filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); transition: transform 0.2s ease; }
  .obc-pin-wrapper:hover .obc-pin-svg,
  .obc-pin-wrapper.is-active .obc-pin-svg { transform: scale(1.18); }
  .obc-pin-pulse {
    position: absolute;
    bottom: -3px;
    width: 14px;
    height: 14px;
    border-radius: 999px;
    background: rgba(234, 67, 53, 0.35);
    animation: obcPulse 1.8s infinite ease-out;
    pointer-events: none;
  }
  @keyframes obcPulse {
    0% { transform: scale(0.8); opacity: 0.9; }
    100% { transform: scale(2.6); opacity: 0; }
  }
  .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 2px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.18) !important; }
  .leaflet-popup-content { margin: 12px 14px !important; line-height: 1.45 !important; }
  .obc-popup-title { font-size: 13px; font-weight: 700; color: #111111; margin: 0 0 4px 0; }
  .obc-popup-addr { font-size: 12px; font-weight: 600; color: #1F3320; margin: 0 0 4px 0; }
  .obc-popup-coord {
    display: inline-block;
    font-size: 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: #F3F8E8;
    color: #1F3320;
    border: 1px solid #CDF178;
    border-radius: 6px;
    padding: 2px 6px;
    margin-bottom: 6px;
  }
  .obc-popup-info { font-size: 11px; color: #555555; margin: 2px 0; }
  .obc-popup-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #1F3320 !important;
    background: #CDF178;
    padding: 5px 10px;
    border-radius: 999px;
    text-decoration: none;
  }
  .obc-popup-link:hover { background: #bfe860; }
</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map', {
    zoomControl: false,
    center: [-6.8748, 107.6075],
    zoom: 14
  });

  L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=id', {
    maxZoom: 20,
    attribution: '&copy; Google Maps'
  }).addTo(map);

  const markersLayer = L.layerGroup().addTo(map);
  let markerMap = new Map();
  let currentLocations = [];

  function createPinIcon(loc, isSelected) {
    const primaryUnit = loc.units[0] || loc.address;
    const extraCount = loc.units.length > 1 ? ' +' + (loc.units.length - 1) : '';
    const html = \`
      <div class="obc-pin-wrapper \${isSelected ? 'is-active' : ''}">
        <div class="obc-pin-badge">\${primaryUnit}<span>\${extraCount}</span></div>
        <svg class="obc-pin-svg" width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 0C6.71573 0 0 6.71573 0 15C0 25.25 13.4 36.7 14.1 37.3C14.62 37.75 15.38 37.75 15.9 37.3C16.6 36.7 30 25.25 30 15C30 6.71573 23.2843 0 15 0Z" fill="#EA4335"/>
          <circle cx="15" cy="14.5" r="6.5" fill="#FFFFFF"/>
          <circle cx="15" cy="14.5" r="3.5" fill="#1F3320"/>
        </svg>
        <div class="obc-pin-pulse"></div>
      </div>
    \`;
    return L.divIcon({
      className: '',
      html,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
      popupAnchor: [0, -42]
    });
  }

  function renderMarkers(locs, selectedId, fitView) {
    currentLocations = locs || [];
    markersLayer.clearLayers();
    markerMap.clear();

    if (!currentLocations.length) return;

    const latLngs = [];
    currentLocations.forEach((loc) => {
      latLngs.push([loc.lat, loc.lng]);
      const isSelected = loc.id === selectedId;
      const marker = L.marker([loc.lat, loc.lng], {
        icon: createPinIcon(loc, isSelected),
        zIndexOffset: isSelected ? 1000 : 0
      });

      const unitsHtml = loc.units.join(' &bull; ');
      const infoHtml = (loc.info || []).map((item) => \`<div class="obc-popup-info">&bull; \${item}</div>\`).join('');
      const gmapsUrl = \`https://www.google.com/maps?q=\${loc.lat},\${loc.lng}\`;

      marker.bindPopup(\`
        <div>
          <div class="obc-popup-title">\${unitsHtml}</div>
          <div class="obc-popup-addr">\${loc.address}</div>
          <div class="obc-popup-coord">Geotag: \${loc.lat.toFixed(4)}, \${loc.lng.toFixed(4)}</div>
          \${infoHtml}
          <a class="obc-popup-link" href="\${gmapsUrl}" target="_blank" rel="noreferrer">Buka di Google Maps &#8599;</a>
        </div>
      \`, { maxWidth: 260 });

      marker.on('click', () => {
        window.parent.postMessage({ type: 'MARKER_CLICKED', id: loc.id }, '*');
      });

      marker.addTo(markersLayer);
      markerMap.set(loc.id, { marker, loc });
    });

    if (selectedId && markerMap.has(selectedId)) {
      const target = markerMap.get(selectedId);
      map.flyTo([target.loc.lat, target.loc.lng], 17, { duration: 0.7 });
      target.marker.openPopup();
    } else if (fitView) {
      if (latLngs.length === 1) {
        map.flyTo(latLngs[0], 17, { duration: 0.6 });
      } else {
        const bounds = L.latLngBounds(latLngs);
        map.flyToBounds(bounds, { padding: [55, 55], maxZoom: 16, duration: 0.7 });
      }
    }
  }

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'UPDATE_MAP') {
      renderMarkers(data.locations, data.selectedId, data.fitView);
    } else if (data.type === 'ZOOM_IN') {
      map.zoomIn();
    } else if (data.type === 'ZOOM_OUT') {
      map.zoomOut();
    } else if (data.type === 'FIT_ALL') {
      renderMarkers(currentLocations, null, true);
    }
  });

  map.whenReady(() => {
    window.parent.postMessage({ type: 'MAP_READY' }, '*');
  });
</script>
</body>
</html>`

export default function Lokasi() {
	const { t } = useTranslation()
	const [activeCategory, setActiveCategory] = useState<(typeof locationCategories)[number]>('all')
	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
	const [mapLoaded, setMapLoaded] = useState(false)
	const iframeRef = useRef<HTMLIFrameElement | null>(null)

	const filteredLocations = useMemo(
		() =>
			activeCategory === 'all'
				? locations
				: locations.filter(
						(l) =>
							l.category === activeCategory ||
							(activeCategory === 'fnb' && l.units.some((u) => u.includes('Food Court') || u.includes('Coffee'))) ||
							(activeCategory === 'lifestyle' && l.units.some((u) => u.includes('Laundry')))
				  ),
		[activeCategory]
	)

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (!event.data || typeof event.data !== 'object') return
			if (event.data.type === 'MAP_READY') {
				setMapLoaded(true)
				iframeRef.current?.contentWindow?.postMessage(
					{
						type: 'UPDATE_MAP',
						locations: filteredLocations,
						selectedId: null,
						fitView: true,
					},
					'*'
				)
			} else if (event.data.type === 'MARKER_CLICKED' && typeof event.data.id === 'string') {
				setSelectedLocationId(event.data.id)
			}
		}
		window.addEventListener('message', handleMessage)
		return () => window.removeEventListener('message', handleMessage)
	}, [filteredLocations])

	useEffect(() => {
		if (!mapLoaded) return
		iframeRef.current?.contentWindow?.postMessage(
			{
				type: 'UPDATE_MAP',
				locations: filteredLocations,
				selectedId: selectedLocationId,
				fitView: true,
			},
			'*'
		)
	}, [filteredLocations, selectedLocationId, mapLoaded])

	const changeZoom = (delta: number) => {
		iframeRef.current?.contentWindow?.postMessage(
			{ type: delta > 0 ? 'ZOOM_IN' : 'ZOOM_OUT' },
			'*'
		)
	}

	const resetMapBounds = () => {
		setSelectedLocationId(null)
		iframeRef.current?.contentWindow?.postMessage({ type: 'FIT_ALL' }, '*')
	}

	// Satu kartu lokasi. placeholder=true dipakai untuk salinan tak terlihat (pengunci tinggi),
	// jadi tombol "lihat lokasi" dirender sebagai span agar tidak bisa difokus.
	const renderLocation = (loc: Location, i: number, placeholder = false) => {
		const isSelected = !placeholder && selectedLocationId === loc.id
		const gmapsHref = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`

		return (
			<div
				className={`mt-3 rounded-[6px] border px-3 py-4 transition-colors first:mt-0 md:mt-0 md:rounded-none md:border-0 md:border-t md:px-2 lg:py-[clamp(8px,1.6svh,14px)] ${
					placeholder ? 'border-[#e5e5e5]' : 'cursor-pointer border-[#e5e5e5] hover:bg-[#CDF17826]'
				} ${isSelected ? 'bg-[#CDF17833]' : ''}`}
				key={loc.id || i}
				onClick={
					placeholder
						? undefined
						: () => setSelectedLocationId((prev) => (prev === loc.id ? null : loc.id))
				}
			>
				{/* Alamat + tombol lihat lokasi */}
				<div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-3">
					<span className="inline-flex min-w-0 flex-1 items-center gap-2 font-['Montserrat'] text-[17px] font-semibold leading-[22px] tracking-normal text-[#000000] md:text-[15px] md:leading-[20.63px]">
						<span className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] bg-[#EDEDED] lg:h-[clamp(26px,4svh,32px)] lg:w-[clamp(26px,4svh,32px)]">
							<img src={locationIcon} alt="" aria-hidden="true" className="h-4 w-4 object-contain" />
						</span>
						<span className="min-w-0">{loc.address}</span>
					</span>
					{placeholder ? (
						<span className="inline-flex shrink-0 items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto">
							{t('common.viewLocation')}
							<span className="grid h-6 w-6 place-items-center">
								<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
							</span>
						</span>
					) : (
						<a
							href={gmapsHref}
							target="_blank"
							rel="noreferrer"
							onClick={(e) => e.stopPropagation()}
							className="inline-flex shrink-0 items-center gap-1.5 self-end font-heading text-[13px] font-semibold text-[#111111] md:self-auto"
						>
							{t('common.viewLocation')}
							<span className="grid h-6 w-6 place-items-center">
								<img src={locationArrowIcon} alt="" aria-hidden="true" className="h-[18px] w-[18px] object-contain" />
							</span>
						</a>
					)}
				</div>

				{loc.units.length > 1 ? (
					<div className="my-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-heading text-[13px] font-semibold text-[#111111] md:gap-x-2 md:text-[15px] lg:my-[clamp(4px,1svh,10px)] lg:text-[clamp(12px,1.9svh,15px)]">
						{loc.units.map((u, idx) => (
							<span className="flex items-center gap-2" key={u}>
								{idx > 0 && <i className="h-1 w-1 rounded-full bg-[#111111]" />}
								{u}
							</span>
						))}
					</div>
				) : (
					<p className="my-2.5 font-heading text-[15px] font-semibold text-[#111111] lg:my-[clamp(4px,1svh,10px)] lg:text-[clamp(13px,1.9svh,15px)]">
						{loc.units[0]}
					</p>
				)}

				{/* Info jam / check-in + koordinat geotag */}
				{loc.info.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{loc.info.map((text) => (
							<span
								className="inline-flex min-h-[23px] w-fit max-w-full items-center rounded-[12px] bg-[#EDEDED] px-2 py-[2px] font-['Montserrat'] text-[10px] font-medium leading-[16.5px] tracking-normal text-[#000000]"
								key={text}
							>
								{text}
							</span>
						))}
						<span className="inline-flex min-h-[23px] w-fit max-w-full items-center rounded-[12px] bg-[#CDF17866] px-2 py-[2px] font-['Montserrat'] text-[10px] font-semibold leading-[16.5px] tracking-normal text-[#1F3320]">
							📍 {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
						</span>
					</div>
				)}
			</div>
		)
	}

	return (
		// Rata tengah vertikal. Karena tinggi daftar dikunci (lihat bagian daftar lokasi),
		// posisi section tidak bergeser saat pindah kategori.
		<section
			className="flex flex-col justify-center overflow-hidden py-10 md:py-12"
		>
			<div className="mx-auto grid w-[calc(100%-40px)] max-w-[1280px] gap-7 md:w-[calc(100%-48px)] md:gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-stretch lg:gap-[clamp(32px,4vw,64px)]">
				{/* Panel kiri */}
				<div className="min-w-0">
					<span className="mb-2 block w-full max-w-[856px] font-['Montserrat'] text-[13px] font-semibold uppercase leading-[20px] tracking-[2px] text-[#000000CC] md:text-[16px] md:tracking-[1.4px] lg:mb-[clamp(4px,1svh,10px)] lg:text-[clamp(13px,2.25svh,18px)]">
						{t('locationSection.badge')}
					</span>
					<h2 className="w-full max-w-[527px] font-['Montserrat'] text-[22px] font-bold leading-[30px] tracking-normal text-[#000000] md:text-[24px] md:leading-[27.5px] md:tracking-[1.5px] lg:text-[clamp(20px,3.25svh,26px)] lg:leading-[clamp(24px,3.75svh,30px)]">
						{t('locationSection.title')}
					</h2>
					<p className="my-3 w-full max-w-[527px] text-justify font-['Montserrat'] text-[14px] font-normal leading-[22px] tracking-normal text-[#000000] md:text-[13px] md:leading-[21.13px] lg:my-[clamp(6px,1.2svh,12px)] lg:text-[clamp(12px,1.75svh,14px)] lg:leading-[clamp(18px,2.7svh,22px)]">
						{t('locationSection.description')}
					</p>

					{/* Filter tabs: satu baris sejajar (nowrap). Mobile: bisa digeser horizontal */}
					<div className="-mx-1 mb-4 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] md:gap-2.5 lg:mb-[clamp(6px,1.2svh,14px)] lg:overflow-visible [&::-webkit-scrollbar]:hidden">
						{locationCategories.map((cat) => (
							<button
								key={cat}
								type="button"
								className={`shrink-0 cursor-pointer whitespace-nowrap rounded-full px-3.5 py-1.5 font-heading text-[12px] font-medium transition-colors md:px-4 md:text-[13px] lg:px-[clamp(10px,1.2vw,16px)] lg:py-[clamp(4px,0.8svh,6px)] ${
									activeCategory === cat
										? 'bg-[#CDF178E5] text-[#000000]'
										: 'bg-[#f0f0f0] text-[#111111] hover:bg-[#e5e5e5]'
								}`}
								onClick={() => {
									setSelectedLocationId(null)
									setActiveCategory(cat)
								}}
							>
								{t(`locationSection.categories.${cat}`)}
							</button>
						))}
					</div>

					{/* Daftar lokasi.
					    Di md+: dua lapisan di sel grid yang sama.
					    - Lapisan 1 (invisible): SEMUA lokasi, hanya untuk mengunci tinggi.
					    - Lapisan 2: daftar sesuai filter, rata atas.
					    Sehingga tinggi kolom kiri (dan peta) tetap sama di semua kategori. */}
					<div className="md:grid">
						<div className="hidden md:invisible md:col-start-1 md:row-start-1 md:block" aria-hidden="true">
							{locations.map((loc, i) => renderLocation(loc, i, true))}
						</div>
						<div className="md:col-start-1 md:row-start-1 md:self-start">
							{filteredLocations.map((loc, i) => renderLocation(loc, i))}
						</div>
					</div>
				</div>

				{/* Panel kanan: peta. Di lg tinggi mengikuti kolom kiri (stretch) */}
				<div className="box-border flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-[8px] bg-[#EDEDED80] p-[14px] shadow-[0px_1px_2px_0px_#0000000D] md:h-[420px] lg:h-auto lg:min-h-[420px]">
					{/* Header peta */}
					<div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#e5e5e5] px-4 py-3 max-sm:px-2 lg:py-[clamp(6px,1.5svh,12px)]">
						<div className="flex min-w-0 items-center gap-2">
							<i className="h-2 w-2 shrink-0 rounded-full bg-[#111111]" />
							<span className="truncate font-['Montserrat'] text-[14px] font-semibold uppercase leading-[20px] tracking-[0.7px] text-[#000000] max-sm:text-[10px] max-sm:tracking-[0.2px]">
								{t('locationSection.mapTitle')}
							</span>
						</div>
						<span className="pointer-events-none box-border inline-flex h-[18px] shrink-0 items-center justify-center whitespace-nowrap rounded-[12px] bg-[#CDF1784D] px-3 py-[2px] font-['Montserrat'] text-[11px] font-medium leading-[14px] tracking-[0.88px] text-[#000000] shadow-[0px_1px_1px_0px_#00000040] max-sm:px-2 max-sm:text-[8px] max-sm:tracking-[0.2px]">
							Live Interactive Map
						</span>
					</div>

					{/* Area peta: mobile 260px, md+ mengisi sisa tinggi panel */}
					<div className="relative mt-3 h-[260px] w-full overflow-hidden bg-[#f2f4f8] md:h-auto md:min-h-0 md:flex-1">
						{/* Placeholder berdenyut selama peta belum selesai dimuat, memudar saat peta siap */}
						<div
							aria-hidden="true"
							className={`pointer-events-none absolute inset-0 animate-pulse bg-[#e6e9f0] transition-opacity duration-700 ease-out ${mapLoaded ? 'opacity-0' : 'opacity-100'}`}
						/>

						<iframe
							ref={iframeRef}
							className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-700 ease-out ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
							title="Peta Geotag Lokasi OBC Group"
							srcDoc={GEOTAG_MAP_HTML}
							loading="lazy"
						/>

						{/* Kontrol zoom & tampilkan semua titik */}
						<div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
							<button
								className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
								type="button"
								aria-label="Zoom in"
								onClick={() => changeZoom(1)}
							>
								<Plus size={16} />
							</button>
							<button
								className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
								type="button"
								aria-label="Zoom out"
								onClick={() => changeZoom(-1)}
							>
								<Minus size={16} />
							</button>
							<button
								className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg bg-white text-[#111111] shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-[#f5f5f5]"
								type="button"
								title="Tampilkan semua titik lokasi"
								aria-label="Tampilkan semua titik lokasi"
								onClick={resetMapBounds}
							>
								<LocateFixed size={16} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
