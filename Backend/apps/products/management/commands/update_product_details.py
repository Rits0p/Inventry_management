"""
Bulk-update all products with full descriptions, highlights and specifications.

Usage:
    python manage.py update_product_details
"""
from django.core.management.base import BaseCommand
from products.models import Product


PRODUCT_DETAILS = {
    'NovaBook Air 14 Laptop': {
        'description': (
            'The Nexon NovaBook Air 14 is an ultra-lightweight laptop designed for professionals '
            'and students who need performance on the go. Powered by a 12th-generation Intel Core '
            'i5 processor with 16GB of LPDDR5 RAM, it handles multitasking, spreadsheet work and '
            'content browsing with ease.\n\n'
            'The 14-inch Full HD IPS display delivers crisp visuals with slim bezels, while the '
            '512GB NVMe SSD ensures fast boot times and quick file transfers. Weighing just 1.3 kg '
            'with an all-aluminium chassis, it slips easily into any bag. The 54Wh battery provides '
            'up to 12 hours of real-world use, making it ideal for full workdays without a charger.\n\n'
            'Windows 11 comes pre-installed along with a one-year Microsoft 365 subscription. '
            'Connectivity includes dual USB-C ports with Power Delivery, a USB-A 3.2 port, '
            'a headphone jack and Wi-Fi 6.'
        ),
        'highlights': [
            '12th-gen Intel Core i5 processor for smooth multitasking',
            '14-inch Full HD IPS display with narrow bezels',
            '16GB LPDDR5 RAM and 512GB NVMe SSD',
            'Ultra-light aluminium body weighing just 1.3 kg',
            'Up to 12 hours of battery life on a single charge',
            'Dual USB-C with Power Delivery charging',
            'Wi-Fi 6 for fast and stable wireless connections',
            'Pre-loaded with Windows 11 and 1-year Microsoft 365',
        ],
        'specifications': [
            {'label': 'Processor', 'value': '12th Gen Intel Core i5-1235U'},
            {'label': 'RAM', 'value': '16GB LPDDR5'},
            {'label': 'Storage', 'value': '512GB NVMe SSD'},
            {'label': 'Display', 'value': '14" Full HD (1920x1080) IPS'},
            {'label': 'Graphics', 'value': 'Intel Iris Xe'},
            {'label': 'Battery', 'value': '54Wh, up to 12 hours'},
            {'label': 'Weight', 'value': '1.3 kg'},
            {'label': 'OS', 'value': 'Windows 11 Home'},
            {'label': 'Ports', 'value': '2x USB-C, 1x USB-A 3.2, 1x 3.5mm jack'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 6, Bluetooth 5.2'},
        ],
    },
    'TitanPro X15 Gaming Laptop': {
        'description': (
            'The Vexar TitanPro X15 is a high-performance 15.6-inch gaming laptop built for '
            'competitive gamers and content creators who demand raw power. Equipped with an '
            'NVIDIA GeForce RTX 4060 GPU and an Intel Core i7-13700H processor, it delivers '
            'smooth frame rates in AAA titles and accelerated rendering in creative apps.\n\n'
            'The 15.6-inch 144Hz Full HD IPS display provides fluid visuals with a 3ms response '
            'time, while 16GB of DDR5 RAM and a 1TB NVMe SSD keep loading times minimal. The '
            'advanced dual-fan cooling system with quad heat pipes keeps thermals in check during '
            'long gaming sessions.\n\n'
            'A per-key RGB backlit keyboard, Nahimic 3D audio, Wi-Fi 6E and a full-size HDMI 2.1 '
            'port round out the package. The 90Wh battery supports up to 8 hours of light use, '
            'and the 240W adapter provides rapid charging.'
        ),
        'highlights': [
            'NVIDIA GeForce RTX 4060 GPU with 8GB GDDR6 VRAM',
            '13th-gen Intel Core i7-13700H 14-core processor',
            '15.6-inch 144Hz IPS display with 3ms response time',
            '16GB DDR5 RAM and 1TB NVMe SSD for fast load times',
            'Advanced dual-fan quad-heat-pipe cooling system',
            'Per-key RGB backlit gaming keyboard',
            'Nahimic 3D surround sound audio',
            'Wi-Fi 6E and Bluetooth 5.3 connectivity',
        ],
        'specifications': [
            {'label': 'Processor', 'value': '13th Gen Intel Core i7-13700H'},
            {'label': 'GPU', 'value': 'NVIDIA GeForce RTX 4060 8GB GDDR6'},
            {'label': 'RAM', 'value': '16GB DDR5 4800MHz'},
            {'label': 'Storage', 'value': '1TB NVMe PCIe Gen4 SSD'},
            {'label': 'Display', 'value': '15.6" Full HD (1920x1080) IPS, 144Hz'},
            {'label': 'Response Time', 'value': '3ms'},
            {'label': 'Battery', 'value': '90Wh, up to 8 hours'},
            {'label': 'Weight', 'value': '2.1 kg'},
            {'label': 'OS', 'value': 'Windows 11 Home'},
            {'label': 'Ports', 'value': '1x HDMI 2.1, 1x USB-C, 2x USB-A, 1x RJ45'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 6E, Bluetooth 5.3'},
        ],
    },
    'SlimLine Business Ultrabook': {
        'description': (
            'The Corvex SlimLine Business Ultrabook is a premium portable machine designed for '
            'professionals who value style, security and all-day productivity. Its thin magnesium-alloy '
            'chassis weighs only 1.1 kg while meeting MIL-STD-810H durability standards.\n\n'
            'Under the hood, an Intel Core i5-1340P processor paired with 16GB of LPDDR5 RAM powers '
            'through office workflows, video calls and light creative tasks without hesitation. The '
            '13.3-inch Full HD touchscreen with anti-glare coating is comfortable for long reading '
            'sessions.\n\n'
            'Security features include a fingerprint reader embedded in the power button, a physical '
            'webcam privacy shutter and a Trusted Platform Module (TPM 2.0) chip. The backlit keyboard '
            'and large glass touchpad make typing a pleasure even in low-light environments.'
        ),
        'highlights': [
            'MIL-STD-810H rated magnesium-alloy chassis',
            'Weighs just 1.1 kg — one of the lightest in its class',
            '13.3-inch Full HD IPS touchscreen with anti-glare coating',
            'Fingerprint reader and TPM 2.0 for enterprise security',
            'Physical webcam privacy shutter for peace of mind',
            'Backlit keyboard for comfortable low-light typing',
            '16GB LPDDR5 RAM for smooth multitasking',
            'Intel Core i5-1340P efficient 12-core processor',
        ],
        'specifications': [
            {'label': 'Processor', 'value': '13th Gen Intel Core i5-1340P'},
            {'label': 'RAM', 'value': '16GB LPDDR5'},
            {'label': 'Storage', 'value': '512GB NVMe SSD'},
            {'label': 'Display', 'value': '13.3" Full HD (1920x1080) IPS Touch'},
            {'label': 'Graphics', 'value': 'Intel Iris Xe'},
            {'label': 'Battery', 'value': '60Wh, up to 14 hours'},
            {'label': 'Weight', 'value': '1.1 kg'},
            {'label': 'Durability', 'value': 'MIL-STD-810H certified'},
            {'label': 'Security', 'value': 'Fingerprint reader, TPM 2.0, webcam shutter'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 6E, Bluetooth 5.3'},
        ],
    },
    'StudioBook Pro 16 Creator': {
        'description': (
            'The Nexon StudioBook Pro 16 is a powerhouse creator laptop engineered for video editors, '
            '3D artists and photographers who need desktop-class performance in a portable form factor. '
            'Driven by an Intel Core i9-13900H processor and an NVIDIA RTX 4070 GPU, it crushes '
            'rendering timelines and GPU-accelerated workloads.\n\n'
            'The centrepiece is a stunning 16-inch 2.5K IPS display with 100% DCI-P3 colour gamut '
            'coverage and factory Delta E < 2 colour accuracy, making it suitable for professional '
            'colour grading and print proofing. 32GB of DDR5 RAM and a 1TB NVMe SSD handle massive '
            'project files and 4K video footage with ease.\n\n'
            'An SD Express 7.0 card reader, Thunderbolt 4 ports, a full-size HDMI 2.1 output and a '
            '1080p webcam with Windows Hello face recognition complete the professional-grade feature '
            'set. The vapour-chamber cooling system maintains sustained performance under prolonged loads.'
        ),
        'highlights': [
            'Intel Core i9-13900H 14-core processor for extreme performance',
            'NVIDIA RTX 4070 GPU for GPU-accelerated creative workflows',
            '16-inch 2.5K display with 100% DCI-P3 and Delta E < 2',
            '32GB DDR5 RAM for handling large project files',
            '1TB NVMe SSD for fast media storage',
            'Thunderbolt 4 and SD Express 7.0 card reader',
            '1080p webcam with Windows Hello face recognition',
            'Vapour-chamber cooling for sustained performance',
        ],
        'specifications': [
            {'label': 'Processor', 'value': '13th Gen Intel Core i9-13900H'},
            {'label': 'GPU', 'value': 'NVIDIA GeForce RTX 4070 8GB GDDR6'},
            {'label': 'RAM', 'value': '32GB DDR5 5200MHz'},
            {'label': 'Storage', 'value': '1TB NVMe PCIe Gen4 SSD'},
            {'label': 'Display', 'value': '16" 2.5K (2560x1600) IPS, 100% DCI-P3'},
            {'label': 'Color Accuracy', 'value': 'Delta E < 2, factory calibrated'},
            {'label': 'Battery', 'value': '90Wh, up to 10 hours'},
            {'label': 'Weight', 'value': '2.0 kg'},
            {'label': 'Ports', 'value': '2x Thunderbolt 4, 1x HDMI 2.1, SD Express 7.0'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 6E, Bluetooth 5.3'},
        ],
    },
    'Pulse X5 Pro 5G': {
        'description': (
            'The Zentech Pulse X5 Pro 5G is a feature-packed mid-range smartphone that punches well '
            'above its price. Its 6.6-inch 120Hz AMOLED display delivers vibrant colours and buttery-smooth '
            'scrolling, while the Qualcomm Snapdragon 7 Gen 2 chipset ensures lag-free performance in '
            'everyday tasks and gaming alike.\n\n'
            'The triple-camera system headlined by a 50MP OIS main sensor captures sharp and stable photos '
            'in all lighting conditions, aided by a 12MP ultrawide lens and a 2MP macro shooter. The 5000mAh '
            'battery supports blazing 67W TurboPower fast charging, going from zero to full in under 45 minutes.\n\n'
            'Running stock Android 14 with a promise of two years of OS updates and three years of security '
            'patches, the Pulse X5 Pro offers a clean, bloatware-free experience. Side-mounted fingerprint '
            'scanner, dual stereo speakers and IP54 splash resistance round out the package.'
        ),
        'highlights': [
            '6.6-inch 120Hz AMOLED display for vibrant visuals',
            '50MP OIS main camera for sharp, stable photos',
            'Qualcomm Snapdragon 7 Gen 2 for smooth performance',
            '5000mAh battery with 67W fast charging (0-100% in ~45 min)',
            'Stock Android 14 with 2 years of OS updates',
            'Dual stereo speakers for immersive audio',
            'IP54 splash and dust resistance',
            'Side-mounted fingerprint scanner for quick unlock',
        ],
        'specifications': [
            {'label': 'Display', 'value': '6.6" Full HD+ AMOLED, 120Hz'},
            {'label': 'Processor', 'value': 'Qualcomm Snapdragon 7 Gen 2'},
            {'label': 'RAM', 'value': '8GB LPDDR5'},
            {'label': 'Storage', 'value': '128GB UFS 3.1'},
            {'label': 'Rear Camera', 'value': '50MP OIS + 12MP Ultrawide + 2MP Macro'},
            {'label': 'Front Camera', 'value': '16MP'},
            {'label': 'Battery', 'value': '5000mAh, 67W TurboPower'},
            {'label': 'OS', 'value': 'Android 14 (Stock)'},
            {'label': 'Connectivity', 'value': '5G, Wi-Fi 6, Bluetooth 5.3, NFC'},
            {'label': 'Protection', 'value': 'IP54, Gorilla Glass 5'},
        ],
    },
    'Pulse Lite 5G': {
        'description': (
            'The Zentech Pulse Lite 5G makes next-generation connectivity accessible to everyone. '
            'Powered by the MediaTek Dimensity 6100+ chipset, it delivers dependable 5G speeds '
            'and smooth day-to-day performance without breaking the bank.\n\n'
            'A generous 6.5-inch HD+ display is perfect for media consumption and social browsing, '
            'while the massive 5000mAh battery easily lasts two full days of moderate use. When '
            'you do need to recharge, 18W fast charging gets you back up quickly.\n\n'
            'The clean stock Android experience is free from bloatware and backed by two years of '
            'security updates. A 50MP AI camera captures detailed daylight shots, and the dedicated '
            'microSD slot lets you expand storage up to 1TB for all your photos and media.'
        ),
        'highlights': [
            'Affordable 5G connectivity with Dimensity 6100+',
            '6.5-inch HD+ display ideal for everyday use',
            '5000mAh battery lasting up to 2 days',
            '50MP AI camera for detailed daylight photos',
            'Clean stock Android — no bloatware',
            'MicroSD expandable storage up to 1TB',
            'Dual SIM with dedicated microSD slot',
            '2 years of security updates included',
        ],
        'specifications': [
            {'label': 'Display', 'value': '6.5" HD+ (1600x720) IPS, 90Hz'},
            {'label': 'Processor', 'value': 'MediaTek Dimensity 6100+'},
            {'label': 'RAM', 'value': '4GB LPDDR4X'},
            {'label': 'Storage', 'value': '64GB, microSD up to 1TB'},
            {'label': 'Rear Camera', 'value': '50MP AI + 2MP Depth'},
            {'label': 'Front Camera', 'value': '8MP'},
            {'label': 'Battery', 'value': '5000mAh, 18W charging'},
            {'label': 'OS', 'value': 'Android 13 (Stock)'},
            {'label': 'Connectivity', 'value': '5G, Wi-Fi 5, Bluetooth 5.1'},
            {'label': 'SIM', 'value': 'Dual Nano-SIM + microSD'},
        ],
    },
    'Nova Ultra 5G': {
        'description': (
            'The Nexon Nova Ultra 5G is a flagship-grade smartphone that competes with the biggest '
            'names in the industry. Its 6.7-inch 2K AMOLED display with 120Hz adaptive refresh rate '
            'produces stunningly vivid visuals, while the Snapdragon 8 Gen 2 chipset delivers '
            'uncompromising performance for gaming, multitasking and AI-driven tasks.\n\n'
            'The quad-camera array features a 200MP main sensor with optical image stabilisation, '
            'a 12MP ultrawide, a 10MP 3x telephoto and a 3D depth sensor. 4K video recording at '
            '60fps and advanced night mode ensure every shot looks professional.\n\n'
            'A 4800mAh battery supports 50W wired fast charging and 15W Qi wireless charging. '
            'The ceramic back panel with IP68 water and dust resistance, an in-display fingerprint '
            'scanner, stereo speakers tuned by Harman Kardon and 256GB of UFS 4.0 storage make '
            'this a true premium experience.'
        ),
        'highlights': [
            '200MP main camera with OIS for incredible detail',
            '6.7-inch 2K AMOLED display with 120Hz adaptive refresh',
            'Snapdragon 8 Gen 2 flagship processor',
            'IP68 water and dust resistance',
            '50W wired and 15W wireless fast charging',
            'Ceramic back panel for a premium feel',
            'In-display fingerprint scanner',
            'Harman Kardon tuned stereo speakers',
        ],
        'specifications': [
            {'label': 'Display', 'value': '6.7" 2K (1440x3200) AMOLED, 120Hz'},
            {'label': 'Processor', 'value': 'Qualcomm Snapdragon 8 Gen 2'},
            {'label': 'RAM', 'value': '12GB LPDDR5X'},
            {'label': 'Storage', 'value': '256GB UFS 4.0'},
            {'label': 'Rear Camera', 'value': '200MP OIS + 12MP UW + 10MP Tele + 3D Depth'},
            {'label': 'Front Camera', 'value': '32MP'},
            {'label': 'Battery', 'value': '4800mAh, 50W wired, 15W wireless'},
            {'label': 'OS', 'value': 'Android 14'},
            {'label': 'Protection', 'value': 'IP68, Gorilla Glass Victus 2'},
            {'label': 'Connectivity', 'value': '5G, Wi-Fi 6E, Bluetooth 5.3, NFC, UWB'},
        ],
    },
    'MiniGo Compact Phone': {
        'description': (
            'The Quip MiniGo Compact Phone is designed for people who want simplicity without '
            'sacrificing essential smartphone features. Its compact 5.5-inch HD+ display makes it '
            'perfectly one-handable and pocket-friendly, ideal as a secondary phone or for users '
            'who prefer a smaller form factor.\n\n'
            'Powered by a MediaTek Helio G35 processor with 4GB of RAM, it handles calls, messaging, '
            'light social media and navigation without fuss. The 32GB internal storage can be expanded '
            'up to 256GB via microSD.\n\n'
            'A 4000mAh battery comfortably lasts a full day, and USB-C charging keeps things convenient. '
            'The 13MP rear camera and 5MP front camera handle casual photography, while dual SIM support '
            'lets you keep work and personal numbers separate.'
        ),
        'highlights': [
            'Compact 5.5-inch form factor — easy one-hand use',
            'Pocket-friendly and lightweight design',
            '4000mAh battery for all-day use',
            'Dual SIM support for work and personal numbers',
            'MicroSD expandable storage up to 256GB',
            'USB-C charging for modern convenience',
            '13MP rear camera for casual photography',
            'Ideal as a secondary or travel phone',
        ],
        'specifications': [
            {'label': 'Display', 'value': '5.5" HD+ (1480x720) IPS'},
            {'label': 'Processor', 'value': 'MediaTek Helio G35'},
            {'label': 'RAM', 'value': '4GB LPDDR4X'},
            {'label': 'Storage', 'value': '32GB, microSD up to 256GB'},
            {'label': 'Rear Camera', 'value': '13MP'},
            {'label': 'Front Camera', 'value': '5MP'},
            {'label': 'Battery', 'value': '4000mAh, 10W charging'},
            {'label': 'OS', 'value': 'Android 13 (Go Edition)'},
            {'label': 'SIM', 'value': 'Dual Nano-SIM + microSD'},
            {'label': 'Connectivity', 'value': '4G LTE, Wi-Fi 5, Bluetooth 5.0'},
        ],
    },
    'PulseBuds Pro ANC Earbuds': {
        'description': (
            'The Soniq PulseBuds Pro are true wireless earbuds that bring premium active noise '
            'cancellation to an affordable price point. The hybrid ANC system uses dual microphones '
            'to reduce ambient noise by up to 35dB, letting you focus on your music, calls or podcasts '
            'without distractions.\n\n'
            'Custom-tuned 11mm dynamic drivers deliver rich bass and clear mids, while the Transparency '
            'mode lets ambient sound in when you need awareness of your surroundings. Each earbud lasts '
            'up to 8 hours on a single charge, and the compact charging case extends total playback to '
            'an impressive 32 hours.\n\n'
            'IPX5 sweat and splash resistance makes them gym-ready, while Bluetooth 5.3 with multipoint '
            'connectivity lets you switch between your phone and laptop seamlessly. Low-latency gaming '
            'mode reduces audio delay to 60ms for competitive advantage.'
        ),
        'highlights': [
            'Hybrid active noise cancellation reducing noise by up to 35dB',
            'Custom-tuned 11mm dynamic drivers for rich sound',
            'Up to 32 hours total playback with charging case',
            'Transparency mode for awareness of surroundings',
            'IPX5 sweat and splash resistance',
            'Bluetooth 5.3 with multipoint connectivity',
            'Low-latency 60ms gaming mode',
            'Touch controls for music, calls and ANC toggle',
        ],
        'specifications': [
            {'label': 'Driver', 'value': '11mm dynamic'},
            {'label': 'ANC', 'value': 'Hybrid, up to 35dB reduction'},
            {'label': 'Battery (Earbuds)', 'value': 'Up to 8 hours (ANC on)'},
            {'label': 'Battery (Case)', 'value': 'Up to 32 hours total'},
            {'label': 'Charging', 'value': 'USB-C, 10 min = 2 hours playback'},
            {'label': 'Water Resistance', 'value': 'IPX5'},
            {'label': 'Bluetooth', 'value': '5.3 with multipoint'},
            {'label': 'Codec', 'value': 'AAC, SBC'},
            {'label': 'Latency', 'value': '60ms (gaming mode)'},
            {'label': 'Weight', 'value': '5.2g per earbud, 45g case'},
        ],
    },
    'BoomBox Go Bluetooth Speaker': {
        'description': (
            'The Soniq BoomBox Go is a rugged, portable Bluetooth speaker designed for outdoor '
            'adventures, pool parties and beach days. Its IPX7 waterproof rating means it can be '
            'fully submerged in water up to 1 metre for 30 minutes, so rain, splashes and even '
            'accidental drops in the pool are no problem.\n\n'
            'Dual passive bass radiators paired with a 30W driver deliver surprisingly deep and '
            'punchy sound for its compact size. The 18-hour battery life keeps the music going from '
            'sunrise to well past sunset, and the USB-C port doubles as a power bank to charge your '
            'phone in emergencies.\n\n'
            'Pair two BoomBox Go speakers together for stereo sound, or use the built-in microphone '
            'for hands-free calls. Available in five vibrant colours to match your style.'
        ),
        'highlights': [
            'IPX7 waterproof — fully submersible up to 1 metre',
            '30W output with dual passive bass radiators',
            '18-hour battery life for all-day listening',
            'USB-C doubles as a power bank for phone charging',
            'Stereo pairing with a second BoomBox Go',
            'Built-in microphone for hands-free calls',
            'Compact and portable with carry strap',
            'Available in five vibrant colours',
        ],
        'specifications': [
            {'label': 'Output', 'value': '30W RMS'},
            {'label': 'Driver', 'value': '52mm full-range + 2x passive radiators'},
            {'label': 'Battery', 'value': '18 hours at 50% volume'},
            {'label': 'Charging', 'value': 'USB-C, ~3 hours full charge'},
            {'label': 'Water Resistance', 'value': 'IPX7'},
            {'label': 'Bluetooth', 'value': '5.3'},
            {'label': 'Range', 'value': 'Up to 15 metres'},
            {'label': 'Weight', 'value': '680g'},
            {'label': 'Dimensions', 'value': '220 x 90 x 95 mm'},
            {'label': 'In the Box', 'value': 'Speaker, USB-C cable, carry strap, manual'},
        ],
    },
    'StudioMax Over-Ear Headphones': {
        'description': (
            'The Auria StudioMax Over-Ear Headphones are tuned for audiophiles, music producers '
            'and anyone who demands accurate, detailed sound reproduction. The closed-back design '
            'with 40mm beryllium-coated drivers delivers a wide soundstage with tight bass, '
            'detailed mids and sparkling highs.\n\n'
            'A detachable coiled cable with a 6.35mm adapter makes them compatible with professional '
            'audio interfaces and studio gear, while the included 3.5mm cable works with phones and '
            'laptops. The over-ear memory foam cushions isolate external noise naturally and remain '
            'comfortable during marathon listening sessions.\n\n'
            'Foldable construction and a hard-shell carry case make the StudioMax easy to transport. '
            'At 280g, they are light enough for extended wear without fatigue.'
        ),
        'highlights': [
            '40mm beryllium-coated drivers for studio-accurate sound',
            'Closed-back design for natural noise isolation',
            'Detachable coiled cable with 6.35mm studio adapter',
            'Memory foam over-ear cushions for all-day comfort',
            'Wide frequency response capturing every detail',
            'Foldable design with included hard-shell carry case',
            'Lightweight at 280g for fatigue-free sessions',
            'Compatible with audio interfaces, phones and laptops',
        ],
        'specifications': [
            {'label': 'Driver', 'value': '40mm beryllium-coated'},
            {'label': 'Frequency Response', 'value': '5Hz - 40kHz'},
            {'label': 'Impedance', 'value': '64 ohms'},
            {'label': 'Sensitivity', 'value': '102 dB/mW'},
            {'label': 'Cable', 'value': 'Detachable coiled (1.5m-3m), 3.5mm + 6.35mm'},
            {'label': 'Weight', 'value': '280g'},
            {'label': 'Earpad', 'value': 'Memory foam, protein leather'},
            {'label': 'Folding', 'value': 'Yes, with carry case included'},
            {'label': 'Noise Isolation', 'value': 'Passive, up to -25dB'},
            {'label': 'In the Box', 'value': 'Headphones, coiled cable, straight cable, adapter, case'},
        ],
    },
    'AirNeck Neckband Earphones': {
        'description': (
            'The Auria AirNeck Neckband Earphones are designed for active users who want secure, '
            'all-day audio without the hassle of true wireless buds. The magnetic earpieces clip '
            'together around your neck when not in use, so they are always within reach.\n\n'
            '10mm dynamic drivers deliver punchy bass and clear vocals, while Bluetooth 5.2 ensures '
            'a stable connection up to 15 metres. The dedicated low-latency gaming mode reduces '
            'audio delay to 45ms, making these ideal for mobile gaming and video calls.\n\n'
            'A 200mAh battery provides up to 16 hours of playback, and 10 minutes of quick charging '
            'gives you 3 hours of use. IPX4 splash resistance handles sweat and light rain, and '
            'inline controls let you manage music and calls without reaching for your phone.'
        ),
        'highlights': [
            'Magnetic earpieces that clip together around your neck',
            '16-hour battery life on a single charge',
            'Low-latency 45ms gaming mode',
            'IPX4 splash and sweat resistance',
            '10-minute quick charge for 3 hours of playback',
            'Inline remote for music and call controls',
            'Bluetooth 5.2 for stable wireless connectivity',
            'Lightweight neckband design for all-day wear',
        ],
        'specifications': [
            {'label': 'Driver', 'value': '10mm dynamic'},
            {'label': 'Battery', 'value': '16 hours playback, 200mAh'},
            {'label': 'Charging', 'value': 'USB-C, 10 min = 3 hours'},
            {'label': 'Bluetooth', 'value': '5.2'},
            {'label': 'Range', 'value': 'Up to 15 metres'},
            {'label': 'Latency', 'value': '45ms (gaming mode)'},
            {'label': 'Water Resistance', 'value': 'IPX4'},
            {'label': 'Weight', 'value': '32g'},
            {'label': 'Controls', 'value': 'Inline: volume, play/pause, call, mic'},
            {'label': 'In the Box', 'value': 'Earphones, USB-C cable, 3 sets of ear tips, manual'},
        ],
    },
    'VistaView 27" QHD Monitor': {
        'description': (
            'The Vistara VistaView 27" QHD Monitor strikes the perfect balance between productivity '
            'and visual quality. Its 27-inch IPS panel runs at 2560x1440 resolution, delivering '
            'crisp text and vibrant colours across 99% of the sRGB colour space.\n\n'
            'Slim bezels on three sides make it ideal for multi-monitor setups, and the VESA-compatible '
            'stand allows mounting on arms or wall brackets. AMD FreeSync support eliminates screen '
            'tearing during light gaming, while a 75Hz refresh rate provides smoother scrolling '
            'than standard 60Hz panels.\n\n'
            'Blue light filter and flicker-free technology reduce eye strain during long work sessions. '
            'Connectivity includes HDMI 2.0, DisplayPort 1.4 and a built-in USB hub with two USB-A ports.'
        ),
        'highlights': [
            '27-inch QHD (2560x1440) IPS display for sharp visuals',
            '99% sRGB colour coverage for accurate colours',
            'Ultra-slim bezels perfect for multi-monitor setups',
            'AMD FreeSync support for tear-free visuals',
            '75Hz refresh rate for smoother scrolling',
            'Blue light filter and flicker-free technology',
            'VESA 100x100 mount compatible',
            'Built-in USB hub with 2x USB-A ports',
        ],
        'specifications': [
            {'label': 'Display', 'value': '27" QHD (2560x1440) IPS'},
            {'label': 'Refresh Rate', 'value': '75Hz'},
            {'label': 'Response Time', 'value': '5ms (GTG)'},
            {'label': 'Color', 'value': '99% sRGB, 8-bit'},
            {'label': 'Adaptive Sync', 'value': 'AMD FreeSync'},
            {'label': 'Ports', 'value': '1x HDMI 2.0, 1x DisplayPort 1.4, 2x USB-A'},
            {'label': 'Stand', 'value': 'Tilt adjustable (-5° to 15°)'},
            {'label': 'VESA Mount', 'value': '100x100mm'},
            {'label': 'Eye Care', 'value': 'Blue light filter, flicker-free'},
            {'label': 'Power', 'value': '28W typical'},
        ],
    },
    'UltraWide 34" Curved Display': {
        'description': (
            'The Vistara UltraWide 34" Curved Display is a productivity beast that replaces dual '
            'monitor setups with a single, immersive panel. Its 3440x1440 ultrawide resolution on '
            'a gently curved 1800R screen wraps around your field of view, reducing neck movement '
            'and boosting workflow efficiency.\n\n'
            'The 100Hz refresh rate and 4ms response time ensure smooth motion for both work and '
            'casual gaming. 98% DCI-P3 colour coverage and VESA DisplayHDR 400 certification mean '
            'colours are rich and accurate for creative tasks.\n\n'
            'Picture-in-Picture and Picture-by-Picture modes let you connect two sources simultaneously. '
            'A built-in KVM switch lets you control two computers with a single keyboard and mouse. '
            'The height-adjustable, tilt and swivel stand ensures ergonomic comfort.'
        ),
        'highlights': [
            '34-inch 3440x1440 ultrawide curved (1800R) display',
            'Replaces dual-monitor setups with seamless space',
            '100Hz refresh rate and 4ms response time',
            '98% DCI-P3 colour coverage with VESA DisplayHDR 400',
            'Picture-in-Picture and Picture-by-Picture modes',
            'Built-in KVM switch for dual-PC control',
            'Height-adjustable, tilt and swivel ergonomic stand',
            'USB-C connectivity with 65W power delivery',
        ],
        'specifications': [
            {'label': 'Display', 'value': '34" UWQHD (3440x1440) VA, 1800R curve'},
            {'label': 'Refresh Rate', 'value': '100Hz'},
            {'label': 'Response Time', 'value': '4ms (GTG)'},
            {'label': 'Color', 'value': '98% DCI-P3, VESA DisplayHDR 400'},
            {'label': 'Ports', 'value': '2x HDMI 2.1, 1x DP 1.4, 1x USB-C (65W PD)'},
            {'label': 'KVM Switch', 'value': 'Built-in'},
            {'label': 'Stand', 'value': 'Height, tilt, swivel adjustable'},
            {'label': 'VESA Mount', 'value': '100x100mm'},
            {'label': 'Speaker', 'value': '2x 5W built-in'},
            {'label': 'Power', 'value': '55W typical'},
        ],
    },
    'ProArt 24" Colour-Accurate Monitor': {
        'description': (
            'The Pixelon ProArt 24" is a professional-grade monitor designed specifically for photo '
            'editors, colourists and graphic designers who demand precision. Every unit is individually '
            'factory-calibrated to achieve a Delta E value of less than 2, ensuring what you see on '
            'screen matches the final output.\n\n'
            'The 24-inch IPS panel covers 99% of the Adobe RGB and 95% of the DCI-P3 colour gamuts, '
            'making it suitable for print proofing, web design and video colour grading. 10-bit colour '
            'depth (8-bit + FRC) supports over 1 billion colours for smooth gradients.\n\n'
            'A built-in hardware calibration sensor port allows pairing with a spectrophotometer for '
            'periodic recalibration. Connectivity includes HDMI, DisplayPort, a USB-C with 90W PD '
            'for charging laptops, and a USB hub for peripherals.'
        ),
        'highlights': [
            'Factory-calibrated to Delta E < 2 for colour accuracy',
            '99% Adobe RGB and 95% DCI-P3 colour gamut coverage',
            '10-bit colour depth (8-bit + FRC) for smooth gradients',
            'Built-in hardware calibration sensor port',
            'USB-C with 90W power delivery for laptop charging',
            '24-inch IPS panel for wide viewing angles',
            'Anti-glare coating for comfortable long sessions',
            'Built-in USB hub for peripherals',
        ],
        'specifications': [
            {'label': 'Display', 'value': '24" Full HD (1920x1080) IPS'},
            {'label': 'Color Gamut', 'value': '99% Adobe RGB, 95% DCI-P3'},
            {'label': 'Color Depth', 'value': '10-bit (8-bit + FRC)'},
            {'label': 'Delta E', 'value': '< 2, factory calibrated'},
            {'label': 'Ports', 'value': '1x HDMI, 1x DP 1.4, 1x USB-C (90W PD)'},
            {'label': 'USB Hub', 'value': '3x USB-A 3.2 downstream'},
            {'label': 'Stand', 'value': 'Height, tilt, swivel, pivot'},
            {'label': 'Calibration', 'value': 'Hardware sensor port supported'},
            {'label': 'VESA Mount', 'value': '100x100mm'},
            {'label': 'Eye Care', 'value': 'Blue light filter, flicker-free'},
        ],
    },
    'Vortex 25" 165Hz Gaming Monitor': {
        'description': (
            'The Vexar Vortex 25" is a fast IPS gaming monitor that combines speed with visual '
            'quality. Running at a 165Hz refresh rate with a 1ms GTG response time, it eliminates '
            'motion blur and ghosting during fast-paced FPS and racing games.\n\n'
            'NVIDIA G-Sync Compatible and AMD FreeSync Premium certification ensures tear-free, '
            'buttery-smooth gameplay across a wide range of graphics cards. The 25-inch Full HD '
            'panel with 99% sRGB coverage provides vibrant and accurate colours.\n\n'
            'A fully adjustable stand with height, tilt, swivel and pivot support lets you find '
            'the perfect gaming position. Game-assist features include a crosshair overlay, '
            'shadow boost for dark scenes and an FPS counter. HDMI 2.0 and DisplayPort 1.4 '
            'inputs support 165Hz on both PC and next-gen consoles.'
        ),
        'highlights': [
            '165Hz refresh rate for ultra-smooth gameplay',
            '1ms GTG response time eliminates motion blur',
            'NVIDIA G-Sync Compatible and AMD FreeSync Premium',
            'Fast IPS panel with 99% sRGB colour accuracy',
            'Fully adjustable stand (height, tilt, swivel, pivot)',
            'Game-assist features: crosshair, shadow boost, FPS counter',
            'HDMI 2.0 and DisplayPort 1.4 inputs',
            'Low blue light mode for comfortable gaming sessions',
        ],
        'specifications': [
            {'label': 'Display', 'value': '25" Full HD (1920x1080) Fast IPS'},
            {'label': 'Refresh Rate', 'value': '165Hz'},
            {'label': 'Response Time', 'value': '1ms GTG'},
            {'label': 'Adaptive Sync', 'value': 'G-Sync Compatible, FreeSync Premium'},
            {'label': 'Color', 'value': '99% sRGB, 8-bit'},
            {'label': 'Ports', 'value': '2x HDMI 2.0, 1x DisplayPort 1.4'},
            {'label': 'Stand', 'value': 'Height, tilt, swivel, pivot'},
            {'label': 'VESA Mount', 'value': '100x100mm'},
            {'label': 'Game Features', 'value': 'Crosshair, Shadow Boost, FPS Counter'},
            {'label': 'Power', 'value': '35W typical'},
        ],
    },
    'MeshNet AX3000 WiFi 6 Router': {
        'description': (
            'The Netora MeshNet AX3000 is a dual-band WiFi 6 mesh router that blankets your home '
            'with fast, reliable wireless coverage. Capable of combined speeds up to 3000 Mbps '
            '(574 Mbps on 2.4GHz + 2402 Mbps on 5GHz), it handles 4K streaming, online gaming '
            'and heavy multi-device households with ease.\n\n'
            'OFDMA and MU-MIMO technology allow the router to communicate with multiple devices '
            'simultaneously, reducing latency in congested networks. Coverage extends up to 2500 '
            'square feet, and additional MeshNet nodes can be added for larger homes.\n\n'
            'Setup takes less than 5 minutes through the MeshNet companion app, which also provides '
            'parental controls, device prioritisation and real-time network monitoring. WPA3 encryption '
            'and automatic firmware updates keep your network secure.'
        ),
        'highlights': [
            'WiFi 6 dual-band with combined speeds up to 3000 Mbps',
            'OFDMA and MU-MIMO for multi-device efficiency',
            'Coverage up to 2500 sq. ft with mesh expandability',
            'Setup in under 5 minutes via companion app',
            'Parental controls and device prioritisation',
            'WPA3 encryption for enhanced security',
            'Automatic firmware updates for ongoing protection',
            'Gigabit WAN and LAN ports for wired devices',
        ],
        'specifications': [
            {'label': 'Standard', 'value': 'WiFi 6 (802.11ax)'},
            {'label': 'Bands', 'value': 'Dual-band: 2.4GHz (574 Mbps) + 5GHz (2402 Mbps)'},
            {'label': 'Coverage', 'value': 'Up to 2500 sq. ft'},
            {'label': 'Ports', 'value': '1x Gigabit WAN, 3x Gigabit LAN'},
            {'label': 'Technology', 'value': 'OFDMA, MU-MIMO, BSS Coloring'},
            {'label': 'Security', 'value': 'WPA3, WPA2, firewall, guest network'},
            {'label': 'Processor', 'value': '1.7GHz quad-core'},
            {'label': 'RAM', 'value': '512MB'},
            {'label': 'Dimensions', 'value': '220 x 160 x 80 mm'},
            {'label': 'Mesh', 'value': 'Expandable with MeshNet nodes'},
        ],
    },
    'PowerLink 8-Port Gigabit Switch': {
        'description': (
            'The Netora PowerLink 8-Port Gigabit Switch is a compact, fanless network switch '
            'that expands your wired network with plug-and-play simplicity. All 8 Gigabit Ethernet '
            'ports deliver up to 1000 Mbps per port, making it ideal for connecting desktops, '
            'NAS drives, gaming consoles and smart TVs.\n\n'
            'The sturdy metal housing dissipates heat passively, ensuring silent and reliable '
            'operation 24/7. Auto MDI/MDIX eliminates the need for crossover cables, and the '
            'store-and-forward architecture ensures data integrity.\n\n'
            'Green Ethernet technology automatically adjusts power consumption based on cable length '
            'and link status, reducing energy usage by up to 80% on short or idle connections. '
            'Compact enough to fit on any desk or mount under a table.'
        ),
        'highlights': [
            '8 Gigabit Ethernet ports for 1000 Mbps per port',
            'Fanless design for silent 24/7 operation',
            'Sturdy metal housing for heat dissipation',
            'Auto MDI/MDIX — no crossover cables needed',
            'Green Ethernet saves up to 80% energy on short links',
            'Plug-and-play — no configuration required',
            'Store-and-forward architecture for data integrity',
            'Compact desktop or wall-mountable form factor',
        ],
        'specifications': [
            {'label': 'Ports', 'value': '8x Gigabit Ethernet (10/100/1000)'},
            {'label': 'Switching Capacity', 'value': '16 Gbps'},
            {'label': 'MAC Address Table', 'value': '4K entries'},
            {'label': 'Forwarding Rate', 'value': '11.9 Mpps'},
            {'label': 'Housing', 'value': 'Metal, fanless'},
            {'label': 'Power', 'value': '5V/1A external adapter'},
            {'label': 'Energy Saving', 'value': 'IEEE 802.3az (Green Ethernet)'},
            {'label': 'Dimensions', 'value': '160 x 100 x 30 mm'},
            {'label': 'Mounting', 'value': 'Desktop, wall-mount'},
            {'label': 'LED', 'value': 'Per-port link/activity, power'},
        ],
    },
    'RangeXt AC1200 Extender': {
        'description': (
            'The Signalift RangeXt AC1200 Extender eliminates WiFi dead zones in your home by '
            'rebroadcasting your existing router signal at up to 1200 Mbps combined throughput. '
            'Simply plug it into a wall outlet, press the WPS button on your router, and the extender '
            'is operational in under 60 seconds.\n\n'
            'Dual-band operation on 2.4GHz (300 Mbps) and 5GHz (867 Mbps) ensures optimal performance '
            'for different types of devices. The smart signal indicator on the front helps you find '
            'the ideal placement location for maximum coverage.\n\n'
            'An integrated Ethernet port allows you to connect a wired device like a smart TV or gaming '
            'console directly. AP mode transforms the extender into a full access point, while the '
            'compact design blends into any room without clutter.'
        ),
        'highlights': [
            'AC1200 dual-band speeds (300 + 867 Mbps)',
            'One-touch WPS setup — operational in 60 seconds',
            'Smart signal indicator for optimal placement',
            'Built-in Ethernet port for wired device connection',
            'AP mode for creating a new access point',
            'Compact wall-plug design — no desk space needed',
            'Compatible with any WiFi router or ISP gateway',
            'WPA3/WPA2 encryption for secure connections',
        ],
        'specifications': [
            {'label': 'Standard', 'value': 'WiFi 5 (802.11ac)'},
            {'label': 'Bands', 'value': '2.4GHz (300 Mbps) + 5GHz (867 Mbps)'},
            {'label': 'Ports', 'value': '1x Gigabit Ethernet'},
            {'label': 'Setup', 'value': 'WPS button or web interface'},
            {'label': 'Modes', 'value': 'Repeater, Access Point'},
            {'label': 'Security', 'value': 'WPA3, WPA2-PSK'},
            {'label': 'Antenna', 'value': '2x internal'},
            {'label': 'Power', 'value': 'Direct wall plug, 100-240V'},
            {'label': 'Dimensions', 'value': '110 x 75 x 45 mm'},
            {'label': 'Compatibility', 'value': 'Any WiFi 4/5/6 router'},
        ],
    },
    'SecureCam WiFi Smart Camera': {
        'description': (
            'The Watchly SecureCam WiFi Smart Camera keeps an eye on your home around the clock '
            'with 1080p Full HD video and advanced AI-powered person detection. Unlike basic motion '
            'detection, the intelligent algorithm distinguishes between people, pets and vehicles, '
            'dramatically reducing false alerts.\n\n'
            'Infrared night vision provides clear black-and-white footage up to 10 metres in complete darkness, '
            'while the wide 140-degree field of view covers an entire room. Two-way audio lets you '
            'speak to visitors or deter intruders directly from the Watchly companion app.\n\n'
            'Local microSD storage (up to 256GB, not included) keeps your footage private, and optional '
            'cloud backup provides off-site redundancy. Works with Alexa and Google Assistant for '
            'voice-controlled live views.'
        ),
        'highlights': [
            '1080p Full HD video with 30fps recording',
            'AI-powered person detection reduces false alerts',
            '140-degree wide-angle field of view',
            'Infrared night vision up to 10 metres',
            'Two-way audio with built-in speaker and mic',
            'Local microSD storage up to 256GB (not included)',
            'Works with Alexa and Google Assistant',
            'Motion-triggered instant phone alerts',
        ],
        'specifications': [
            {'label': 'Resolution', 'value': '1080p Full HD, 30fps'},
            {'label': 'Field of View', 'value': '140 degrees'},
            {'label': 'Night Vision', 'value': 'Infrared, up to 10m'},
            {'label': 'Detection', 'value': 'AI person / pet / vehicle'},
            {'label': 'Audio', 'value': 'Two-way with noise cancellation'},
            {'label': 'Storage', 'value': 'microSD up to 256GB, cloud optional'},
            {'label': 'Connectivity', 'value': 'WiFi 2.4GHz, Bluetooth 4.2'},
            {'label': 'Power', 'value': '5V/1A USB-C adapter'},
            {'label': 'Smart Home', 'value': 'Alexa, Google Assistant'},
            {'label': 'In the Box', 'value': 'Camera, mount, USB-C cable, adapter, manual'},
        ],
    },
    'StrikeForce Mechanical Keyboard': {
        'description': (
            'The Vexar StrikeForce Mechanical Keyboard is built for gamers and typists who demand '
            'tactile precision and customisation. Featuring hot-swappable mechanical switches, you '
            'can swap out switches without soldering to find your preferred feel — whether that is '
            'clicky Cherry MX Blues or smooth Gateron Yellows.\n\n'
            'Per-key RGB lighting with 16.8 million colours lets you create custom lighting profiles '
            'or sync with in-game effects. The solid aluminium top plate provides a premium, flex-free '
            'typing experience, while the PBT double-shot keycaps resist shine and wear over years of use.\n\n'
            'N-key rollover ensures every keystroke is registered, even during intense gaming sessions. '
            'On-board memory saves up to 5 lighting profiles, and the detachable USB-C cable makes '
            'transportation and replacement effortless.'
        ),
        'highlights': [
            'Hot-swappable switches — customise without soldering',
            'Per-key RGB with 16.8 million colour options',
            'PBT double-shot keycaps that resist shine',
            'Aluminium top plate for premium build quality',
            'N-key rollover for anti-ghosting during gaming',
            'On-board memory storing up to 5 lighting profiles',
            'Detachable USB-C cable for easy transport',
            'Compatible with Gateron, Cherry MX and Kailh switches',
        ],
        'specifications': [
            {'label': 'Switch Type', 'value': 'Hot-swappable mechanical (Gateron Brown included)'},
            {'label': 'Layout', 'value': 'Full-size (104 keys)'},
            {'label': 'Keycaps', 'value': 'PBT double-shot'},
            {'label': 'Lighting', 'value': 'Per-key RGB, 16.8M colours'},
            {'label': 'Top Plate', 'value': 'Aluminium'},
            {'label': 'Anti-Ghosting', 'value': 'N-key rollover (NKRO)'},
            {'label': 'Memory', 'value': 'On-board, 5 profiles'},
            {'label': 'Cable', 'value': 'Detachable USB-C, 1.8m braided'},
            {'label': 'Software', 'value': 'Vexar KeyStudio (Windows/macOS)'},
            {'label': 'Dimensions', 'value': '440 x 135 x 40 mm'},
        ],
    },
    'GlideX Wireless Gaming Mouse': {
        'description': (
            'The Vexar GlideX Wireless Gaming Mouse combines featherweight design with esports-grade '
            'performance. At just 63g, it glides effortlessly across any surface while the PAW3395 '
            'optical sensor delivers pinpoint accuracy up to 16,000 DPI with zero smoothing or '
            'acceleration.\n\n'
            'Tri-mode connectivity lets you switch between 2.4GHz wireless for lag-free gaming, '
            'Bluetooth 5.3 for everyday use and wired USB-C for charging while playing. The '
            'ambidextrous shape with textured rubber side grips accommodates claw, palm and fingertip '
            'grip styles.\n\n'
            'Up to 70 hours of battery life on a single charge means you can game for weeks between '
            'charging sessions. On-the-fly DPI switching, 6 programmable buttons and PTFE feet '
            'complete the package for competitive advantage.'
        ),
        'highlights': [
            'Ultra-lightweight at just 63g for fast movements',
            'PAW3395 sensor with 16K DPI and zero smoothing',
            'Tri-mode: 2.4GHz wireless, Bluetooth 5.3, USB-C wired',
            '70-hour battery life on a single charge',
            'Ambidextrous design with rubber side grips',
            '6 programmable buttons with on-board memory',
            'PTFE feet for ultra-smooth gliding',
            'On-the-fly DPI switching (400-16000)',
        ],
        'specifications': [
            {'label': 'Sensor', 'value': 'PAW3395 Optical'},
            {'label': 'DPI', 'value': '400 to 16,000 (adjustable)'},
            {'label': 'Polling Rate', 'value': '1000Hz (1ms)'},
            {'label': 'Weight', 'value': '63g'},
            {'label': 'Connectivity', 'value': '2.4GHz, Bluetooth 5.3, USB-C'},
            {'label': 'Battery', 'value': '70 hours wireless'},
            {'label': 'Buttons', 'value': '6 programmable'},
            {'label': 'Feet', 'value': 'PTFE'},
            {'label': 'Cable', 'value': 'USB-C, 1.8m braided (charging/gameplay)'},
            {'label': 'Compatible', 'value': 'Windows, macOS, PlayStation, Xbox'},
        ],
    },
    'RumbleCore Elite Controller': {
        'description': (
            'The Playport RumbleCore Elite Controller is a premium gamepad designed for serious '
            'gamers who demand precision and customisation. Hall-effect thumbsticks eliminate stick '
            'drift permanently by using magnetic sensors instead of mechanical potentiometers, '
            'maintaining precision for years of heavy use.\n\n'
            'Four mappable rear paddles let you keep your thumbs on the sticks during intense '
            'gameplay. Tri-mode connectivity supports low-latency 2.4GHz wireless via USB dongle, '
            'Bluetooth 5.0 for mobile gaming and wired USB-C for zero-latency competitive play.\n\n'
            'Adjustable trigger locks switch between full-range triggers for racing games and '
            'hair-trigger mode for FPS. Dual-zone vibration motors and a built-in gyroscope '
            'provide immersive feedback and motion aiming. The companion app allows remapping, '
            'sensitivity curves and firmware updates.'
        ),
        'highlights': [
            'Hall-effect thumbsticks — eliminates stick drift permanently',
            '4 mappable rear paddles for competitive advantage',
            'Tri-mode: 2.4GHz dongle, Bluetooth 5.0, USB-C wired',
            'Adjustable trigger locks (full-range to hair-trigger)',
            'Dual-zone vibration motors for immersive feedback',
            'Built-in gyroscope for motion aiming',
            'Companion app for remapping and sensitivity tuning',
            'Up to 30 hours battery on 2.4GHz wireless',
        ],
        'specifications': [
            {'label': 'Thumbsticks', 'value': 'Hall-effect magnetic sensors'},
            {'label': 'Triggers', 'value': 'Hall-effect with adjustable lock'},
            {'label': 'Paddles', 'value': '4 mappable rear buttons'},
            {'label': 'Connectivity', 'value': '2.4GHz, Bluetooth 5.0, USB-C'},
            {'label': 'Battery', 'value': '30 hours (2.4GHz), 40 hours (BT)'},
            {'label': 'Vibration', 'value': 'Dual-zone motors'},
            {'label': 'Motion', 'value': '6-axis gyroscope + accelerometer'},
            {'label': 'Weight', 'value': '245g'},
            {'label': 'Compatibility', 'value': 'PC, PlayStation, Nintendo Switch, Android'},
            {'label': 'In the Box', 'value': 'Controller, USB dongle, USB-C cable, carry case'},
        ],
    },
    'VR Horizon Headset': {
        'description': (
            'The Playport VR Horizon Headset is a standalone virtual reality headset that requires '
            'no PC, no phone and no external sensors. Powered by a Qualcomm Snapdragon XR2 Gen 1 '
            'processor with 6GB of RAM, it delivers smooth, immersive VR experiences with inside-out '
            'tracking across a wide play area.\n\n'
            'Dual 2K LCD displays at 90Hz provide crisp, fluid visuals through custom pancake lenses '
            'that reduce the headset size by 40% compared to traditional Fresnel designs. The interpupillary '
            'distance (IPD) adjustment dial ensures a comfortable fit for different face shapes.\n\n'
            '128GB of internal storage holds dozens of games and apps, and the rechargeable battery '
            'provides up to 2.5 hours of continuous gameplay. Spatial audio speakers built into the '
            'headband eliminate the need for separate headphones.'
        ),
        'highlights': [
            'Truly standalone — no PC, phone or external sensors needed',
            'Qualcomm Snapdragon XR2 Gen 1 for powerful performance',
            'Dual 2K LCD displays at 90Hz with pancake lenses',
            'Inside-out tracking with no external sensors',
            '128GB internal storage for games and apps',
            'IPD adjustment dial for personalised comfort',
            'Built-in spatial audio speakers',
            'Up to 2.5 hours of continuous gameplay',
        ],
        'specifications': [
            {'label': 'Processor', 'value': 'Qualcomm Snapdragon XR2 Gen 1'},
            {'label': 'RAM', 'value': '6GB LPDDR5'},
            {'label': 'Storage', 'value': '128GB'},
            {'label': 'Display', 'value': 'Dual 2K LCD, 90Hz'},
            {'label': 'Lenses', 'value': 'Pancake'},
            {'label': 'Tracking', 'value': 'Inside-out (6DoF)'},
            {'label': 'Audio', 'value': 'Built-in spatial speakers'},
            {'label': 'Battery', 'value': '2.5 hours continuous play'},
            {'label': 'IPD Range', 'value': '58-72mm adjustable'},
            {'label': 'Weight', 'value': '390g'},
        ],
    },
    'HomeHub Smart Display 8"': {
        'description': (
            'The Domia HomeHub Smart Display 8" is a voice-first control centre for your entire '
            'smart home. Its 8-inch HD touchscreen shows weather, calendars, recipes and live camera '
            'feeds while built-in speakers deliver clear audio for music, alarms and video calls.\n\n'
            'Compatible with over 10,000 smart devices across Wi-Fi, Zigbee and Matter protocols, '
            'it acts as a unified hub for lights, thermostats, locks and cameras from any brand. '
            'The built-in Zigbee radio eliminates the need for separate hub devices.\n\n'
            'Voice control lets you set routines like "Good Morning" that turn on lights, read your '
            'schedule and start brewing coffee — all hands-free. A physical camera shutter and mic '
            'mute switch provide privacy when needed.'
        ),
        'highlights': [
            '8-inch HD touchscreen for visual smart home control',
            'Built-in Zigbee hub — no separate hub needed',
            'Compatible with 10,000+ smart devices across Matter, Zigbee, Wi-Fi',
            'Voice routines: automate lights, schedules and appliances',
            'Dual speakers for music, alarms and video calls',
            'Physical camera shutter and mic mute for privacy',
            'Built-in Chromecast for streaming from your phone',
            'Ambient light sensor for automatic brightness adjustment',
        ],
        'specifications': [
            {'label': 'Display', 'value': '8" HD (1280x800) IPS touchscreen'},
            {'label': 'Processor', 'value': 'Quad-core 1.8GHz'},
            {'label': 'RAM', 'value': '2GB'},
            {'label': 'Storage', 'value': '16GB'},
            {'label': 'Speaker', 'value': '2x full-range drivers + passive radiator'},
            {'label': 'Microphone', 'value': 'Far-field 4-mic array'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 5, Bluetooth 5.0, Zigbee 3.0, Matter'},
            {'label': 'Camera', 'value': '5MP with physical privacy shutter'},
            {'label': 'Smart Home', 'value': 'Alexa, Google Home, Matter compatible'},
            {'label': 'Power', 'value': '15W adapter, ~10W typical consumption'},
        ],
    },
    'BulbGenius Colour Smart Bulbs (2 pk)': {
        'description': (
            'The Domia BulbGenius Colour Smart Bulbs bring 16 million colours and tunable white '
            'lighting to any room with a standard E27 socket. No hub is required — connect them '
            'directly to your Wi-Fi network and control everything from the BulbGenius app on your '
            'phone.\n\n'
            'Set schedules for lights to turn on at sunrise, dim during movie time or simulate '
            'presence while you are away on vacation. Music sync mode pulses the lights in time with '
            'your favourite playlists for party atmosphere.\n\n'
            'Voice control through Alexa and Google Assistant lets you adjust brightness, change '
            'colours and turn lights on or off without lifting a finger. Each bulb consumes just 9W '
            'while producing 800 lumens — equivalent to a 60W incandescent bulb.'
        ),
        'highlights': [
            '16 million colours plus tunable warm-to-cool white',
            'No hub required — connects directly to Wi-Fi',
            'Schedule and automate lighting from the app',
            'Music sync mode pulses with your playlists',
            'Voice control via Alexa and Google Assistant',
            'Energy-efficient 9W producing 800 lumens',
            'E27 standard socket — fits most fixtures',
            '2-pack for multi-room smart lighting',
        ],
        'specifications': [
            {'label': 'Bulb Type', 'value': 'E27 LED'},
            {'label': 'Wattage', 'value': '9W (equivalent to 60W incandescent)'},
            {'label': 'Brightness', 'value': '800 lumens'},
            {'label': 'Colour Range', 'value': '16 million colours + 2700K-6500K white'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 2.4GHz'},
            {'label': 'Smart Home', 'value': 'Alexa, Google Assistant, Matter'},
            {'label': 'Lifespan', 'value': '25,000 hours'},
            {'label': 'Beam Angle', 'value': '220 degrees'},
            {'label': 'Voltage', 'value': '220-240V AC'},
            {'label': 'In the Box', 'value': '2x smart bulbs, quick start guide'},
        ],
    },
    'Sentinel Doorbell Camera': {
        'description': (
            'The Watchly Sentinel Doorbell Camera upgrades your front door with 2K video resolution '
            'and intelligent person detection. Whether wired or running on battery power, it captures '
            'crystal-clear footage of every visitor, package delivery and suspicious activity.\n\n'
            'AI-powered person detection sends you instant alerts only when it spots a human — not '
            'passing cars, blowing leaves or animals. Two-way audio lets you greet delivery drivers '
            'or warn off strangers from anywhere through the Watchly app.\n\n'
            'Night vision with infrared LEDs ensures 24/7 visibility, and the wide 160-degree field '
            'of view covers your entire doorstep. Both wired (existing doorbell wiring) and battery '
            'installation options are supported, with the battery lasting up to 6 months on a single charge.'
        ),
        'highlights': [
            '2K video resolution for clear identification',
            'AI person detection — no false alerts from cars or animals',
            'Two-way audio to greet or warn visitors',
            '160-degree wide field of view covers full doorstep',
            'Infrared night vision for 24/7 visibility',
            'Wired and battery installation options',
            'Battery lasts up to 6 months per charge',
            'Works with Alexa and Google Assistant',
        ],
        'specifications': [
            {'label': 'Resolution', 'value': '2K (2560x1440)'},
            {'label': 'Field of View', 'value': '160 degrees'},
            {'label': 'Night Vision', 'value': 'Infrared, up to 8m'},
            {'label': 'Detection', 'value': 'AI person detection'},
            {'label': 'Audio', 'value': 'Two-way with echo cancellation'},
            {'label': 'Power', 'value': 'Wired (16-24V AC) or rechargeable battery'},
            {'label': 'Battery Life', 'value': 'Up to 6 months'},
            {'label': 'Storage', 'value': 'Cloud (subscription) or local with HomeHub'},
            {'label': 'Connectivity', 'value': 'Wi-Fi 2.4GHz, Bluetooth 4.2'},
            {'label': 'Weather', 'value': 'IP65 rated'},
        ],
    },
    'CleanSweep Robot Vacuum': {
        'description': (
            'The Dustbot CleanSweep Robot Vacuum uses LiDAR navigation to map your home with '
            'centimetre-level precision, creating efficient cleaning paths that cover every corner '
            'without missing spots or redundantly re-cleaning areas. The companion app lets you '
            'set no-go zones, schedule cleaning by room and view the cleaning map in real time.\n\n'
            '4000Pa of suction power picks up dust, pet hair and debris from both hard floors and '
            'carpets, while the auto-boost feature increases power when transitioning to carpeted '
            'surfaces. The large 5200mAh battery cleans up to 280 square metres on a single charge.\n\n'
            'When battery runs low, the CleanSweep automatically returns to its charging dock, '
            'recharges and resumes cleaning from where it left off. A self-emptying dustbin station '
            'is available as an add-on accessory.'
        ),
        'highlights': [
            'LiDAR navigation for precise room mapping',
            '4000Pa suction power for deep cleaning',
            'App control: schedules, no-go zones, room-by-room',
            'Auto-boost increases power on carpeted surfaces',
            '5200mAh battery cleans up to 280 sq. m. per charge',
            'Auto-recharge and resume for large homes',
            'Slim 9.8cm height fits under most furniture',
            'Self-emptying dustbin station available as add-on',
        ],
        'specifications': [
            {'label': 'Navigation', 'value': 'LiDAR + SLAM'},
            {'label': 'Suction', 'value': '4000Pa (max)'},
            {'label': 'Battery', 'value': '5200mAh, up to 280 sq. m.'},
            {'label': 'Dustbin', 'value': '450ml'},
            {'label': 'Height', 'value': '9.8cm'},
            {'label': 'Noise Level', 'value': '55dB (quiet mode) to 68dB (max)'},
            {'label': 'Filter', 'value': 'HEPA H13'},
            {'label': 'Climbing', 'value': 'Up to 2cm threshold'},
            {'label': 'App', 'value': 'CleanSweep (iOS / Android)'},
            {'label': 'In the Box', 'value': 'Robot, dock, power adapter, side brushes, filter'},
        ],
    },
    'VoltCore 20000mAh Power Bank': {
        'description': (
            'The Ampere VoltCore 20000mAh Power Bank is a high-capacity portable charger that keeps '
            'your devices powered through long days, travel and emergencies. The 22.5W USB-C Power '
            'Delivery output fast-charges compatible phones from 0 to 50% in just 30 minutes.\n\n'
            'Dual output ports — USB-C PD and USB-A QC 3.0 — let you charge two devices simultaneously, '
            'while the built-in LED digital display shows remaining capacity in real time so you are '
            'never caught off guard.\n\n'
            'A full charge of the power bank itself takes about 5 hours via USB-C. The slim, pocketable '
            'design at just 230g belies its massive capacity. Built-in overcharge, overcurrent and '
            'short-circuit protection keeps your devices safe.'
        ),
        'highlights': [
            '20000mAh capacity — charges a phone 4-5 times',
            '22.5W USB-C PD fast charging (0-50% in 30 min)',
            'Dual output: USB-C PD + USB-A QC 3.0',
            'LED digital display shows exact remaining capacity',
            'Charge 2 devices simultaneously',
            'Overcharge, overcurrent and short-circuit protection',
            'Slim design at just 230g',
            'USB-C input for fast self-recharge',
        ],
        'specifications': [
            {'label': 'Capacity', 'value': '20000mAh / 74Wh'},
            {'label': 'USB-C Output', 'value': '22.5W PD (5V/3A, 9V/2.5A, 12V/2A)'},
            {'label': 'USB-A Output', 'value': '22.5W QC 3.0 (5V/3A, 9V/2A, 12V/1.5A)'},
            {'label': 'Total Output', 'value': '22.5W (shared)'},
            {'label': 'Input', 'value': 'USB-C, 18W PD'},
            {'label': 'Self-Recharge Time', 'value': '~5 hours'},
            {'label': 'Display', 'value': 'LED digital percentage'},
            {'label': 'Protection', 'value': 'Overcharge, overcurrent, short-circuit, over-temperature'},
            {'label': 'Weight', 'value': '230g'},
            {'label': 'Dimensions', 'value': '145 x 72 x 16 mm'},
        ],
    },
    'Type-C Fast Cable 2m': {
        'description': (
            'The Wirely Type-C Fast Cable 2m is a premium braided USB-C to USB-C cable built to '
            'handle up to 100W of Power Delivery charging and 480 Mbps data transfer. The nylon '
            'braided exterior is rated for over 20,000 bends, making it far more durable than '
            'standard rubber cables.\n\n'
            'At 2 metres long, it gives you the freedom to charge and use your device comfortably '
            'from a distance — whether from a wall outlet to your couch, a car charger to your '
            'backseat or a laptop to a standing desk setup.\n\n'
            'The reinforced zinc-alloy connector housing resists corrosion and wear, while the '
            'integrated E-marker chip ensures safe power delivery to laptops, tablets and phones. '
            'Compatible with all USB-C devices including MacBook, iPad, Samsung Galaxy and more.'
        ),
        'highlights': [
            '100W Power Delivery for fast laptop and phone charging',
            'Nylon braided exterior rated for 20,000+ bends',
            '2-metre length for comfortable reach',
            '480 Mbps data transfer speed',
            'Zinc-alloy reinforced connector housing',
            'E-marker chip for safe power delivery',
            'Compatible with all USB-C devices',
            'Supports USB 2.0 data sync and charging',
        ],
        'specifications': [
            {'label': 'Connector', 'value': 'USB-C to USB-C'},
            {'label': 'Power Delivery', 'value': 'Up to 100W (20V/5A)'},
            {'label': 'Data Transfer', 'value': '480 Mbps (USB 2.0)'},
            {'label': 'Length', 'value': '2 metres'},
            {'label': 'Material', 'value': 'Nylon braided + zinc-alloy connectors'},
            {'label': 'Durability', 'value': '20,000+ bend cycles'},
            {'label': 'Chip', 'value': 'E-marker for safe PD negotiation'},
            {'label': 'Compatibility', 'value': 'All USB-C devices'},
            {'label': 'Colour', 'value': 'Black'},
            {'label': 'Weight', 'value': '65g'},
        ],
    },
    'GripStand Adjustable Phone Holder': {
        'description': (
            'The Perch GripStand Adjustable Phone Holder is a versatile aluminium desk stand that '
            'keeps your phone at the perfect viewing angle for video calls, recipe browsing, media '
            'consumption or desk organisation. The adjustable ball joint allows 360-degree rotation '
            'and tilts from 15 to 75 degrees.\n\n'
            'CNC-machined from a single block of aluminium, the GripStand is both lightweight and '
            'sturdy enough to hold phones up to 300g without wobbling. The non-slip silicone base '
            'protects your desk surface and prevents sliding.\n\n'
            'Compatible with all smartphones from 4.7 to 7 inches, including those with cases up '
            'to 12mm thick. The foldable design collapses flat for easy packing in a bag or pocket.'
        ),
        'highlights': [
            'CNC-machined aluminium — lightweight yet sturdy',
            '360-degree rotation with 15-75 degree tilt',
            'Non-slip silicone base protects desk surface',
            'Holds phones up to 300g without wobbling',
            'Compatible with phones 4.7 to 7 inches (with case)',
            'Folds flat for portable, pocket-friendly storage',
            'Adjustable ball joint for perfect viewing angle',
            'Perfect for video calls, recipes and desk use',
        ],
        'specifications': [
            {'label': 'Material', 'value': 'CNC aluminium + silicone base'},
            {'label': 'Compatibility', 'value': '4.7" to 7" phones (up to 300g)'},
            {'label': 'Case Friendly', 'value': 'Up to 12mm thick'},
            {'label': 'Adjustment', 'value': '360° rotation, 15°-75° tilt'},
            {'label': 'Foldable', 'value': 'Yes, collapses flat'},
            {'label': 'Weight', 'value': '95g'},
            {'label': 'Dimensions', 'value': '75 x 75 x 150 mm (unfolded)'},
            {'label': 'Base', 'value': 'Non-slip silicone pad'},
            {'label': 'Colour', 'value': 'Space Grey'},
            {'label': 'In the Box', 'value': 'Stand, Allen key, manual'},
        ],
    },
    'ShieldGlass Protector (2 pk)': {
        'description': (
            'The Wirely ShieldGlass Protector is a 9H tempered glass screen protector that provides '
            'military-grade scratch and impact protection without compromising touch sensitivity or '
            'display clarity. At just 0.33mm thick, it is virtually invisible once applied.\n\n'
            'Each pack includes two protectors and an innovative installation frame that ensures '
            'perfect, bubble-free alignment every time — no more crooked applications or trapped '
            'dust particles. The oleophobic coating resists fingerprints and smudges.\n\n'
            'The 2.5D rounded edges prevent chipping and provide a smooth feel when swiping from '
            'the screen edges. Compatible with most phone cases thanks to the precision-cut design '
            'that sits within the case lip.'
        ),
        'highlights': [
            '9H hardness — resistant to keys, coins and scratches',
            '0.33mm ultra-thin for natural touch sensitivity',
            'Includes installation frame for bubble-free alignment',
            'Oleophobic coating resists fingerprints',
            '2.5D rounded edges prevent chipping',
            'Crystal-clear transparency preserves display quality',
            'Case-compatible precision-cut design',
            '2 protectors per pack for value and replacement',
        ],
        'specifications': [
            {'label': 'Material', 'value': '9H tempered glass'},
            {'label': 'Thickness', 'value': '0.33mm'},
            {'label': 'Hardness', 'value': '9H (pencil hardness)'},
            {'label': 'Coating', 'value': 'Oleophobic (anti-fingerprint)'},
            {'label': 'Edge', 'value': '2.5D rounded'},
            {'label': 'Transparency', 'value': '99.9%'},
            {'label': 'Quantity', 'value': '2 protectors per pack'},
            {'label': 'Installation', 'value': 'Alignment frame included'},
            {'label': 'Compatibility', 'value': 'Case-friendly, universal fit'},
            {'label': 'In the Box', 'value': '2x protectors, frame, cleaning kit'},
        ],
    },
}


class Command(BaseCommand):
    help = 'Update all products with full descriptions, highlights and specifications.'

    def handle(self, *args, **options):
        updated = 0
        skipped = 0
        for product in Product.objects.all():
            details = PRODUCT_DETAILS.get(product.name)
            if not details:
                self.stdout.write(self.style.WARNING(f'  Skipped (no data): {product.name}'))
                skipped += 1
                continue

            product.description = details['description']
            product.highlights = details['highlights']
            product.specifications = details['specifications']
            product.save(update_fields=['description', 'highlights', 'specifications'])
            updated += 1
            self.stdout.write(f'  Updated: {product.name}')

        self.stdout.write(self.style.SUCCESS(
            f'\nDone — {updated} products updated, {skipped} skipped.'
        ))
