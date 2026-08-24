"""
Seed demo categories and electronics products using the bundled product
photos in Backend/static/electronics_product_images_80/.

Usage:
    python manage.py seed_demo_data
    python manage.py seed_demo_data --refresh-images   # re-copy images over existing ones
    python manage.py seed_demo_data --no-wipe          # keep any existing catalog
"""
from io import BytesIO

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from PIL import Image, ImageDraw, ImageFont

from categories.models import Category
from inventory.models import StockTransaction
from products.models import Product
from users.models import User

IMG_ROOT = settings.BASE_DIR / 'static' / 'electronics_product_images_80'

# category slug -> photo folder inside IMG_ROOT
CATEGORY_IMG_FOLDERS = {
    'laptops': 'Laptops_and_Computers',
    'phones': 'Smartphone',
    'audio': 'Audio_and_Headphones',
    'monitors': 'Monitors_and_Displays',
    'networking': 'Networking',
    'gaming': 'Gaming',
    'smart-home': 'Smart_Home',
    'accessories': 'Accessories',
}

# slug -> (name, description)
CATEGORIES = {
    'laptops': (
        'Laptops & Computers',
        'Laptops and desktops for work, gaming and content creation.',
    ),
    'phones': (
        'Smartphones',
        'Latest 5G flagships and budget-friendly mobile picks.',
    ),
    'audio': (
        'Audio & Headphones',
        'Earbuds, headphones and speakers for every listener.',
    ),
    'monitors': (
        'Monitors & Displays',
        'QHD, ultrawide and high-refresh-rate displays.',
    ),
    'networking': (
        'Networking',
        'Routers, switches, extenders and smart cameras.',
    ),
    'gaming': (
        'Gaming',
        'Keyboards, mice, controllers and VR headsets.',
    ),
    'smart-home': (
        'Smart Home',
        'Smart displays, bulbs, doorbells and robot vacuums.',
    ),
    'accessories': (
        'Accessories',
        'Power banks, cables, stands and screen protection.',
    ),
}

# category_slug, name, brand, price, original_price, discount,
# rating, reviews_count, badge, stock, description, image_file
PRODUCTS = [
    # ── Laptops & Computers ──────────────────────────────────────────────
    ('laptops', 'NovaBook Air 14 Laptop', 'Nexon', '54990.00', '69990.00', 21, '4.60', 1284, 'Bestseller', 18,
     'Ultra-light 14-inch laptop with a 12th-gen processor, 16GB RAM and all-day battery life.', '01.png'),
    ('laptops', 'TitanPro X15 Gaming Laptop', 'Vexar', '89999.00', '119990.00', 25, '4.50', 862, 'New', 11,
     'RTX-powered 15.6-inch 144Hz gaming laptop built for high-frame-rate play.', '02.png'),
    ('laptops', 'SlimLine Business Ultrabook', 'Corvex', '62490.00', '74990.00', 17, '4.40', 540, '', 22,
     'Thin magnesium-alloy ultrabook with a backlit keyboard and fingerprint login.', '03.png'),
    ('laptops', 'StudioBook Pro 16 Creator', 'Nexon', '129990.00', '149990.00', 13, '4.70', 312, 'Premium', 7,
     'Colour-accurate 16-inch creator laptop with 32GB RAM and a 1TB NVMe SSD.', '04.png'),
    # ── Smartphones ──────────────────────────────────────────────────────
    ('phones', 'Pulse X5 Pro 5G', 'Zentech', '18999.00', '21999.00', 14, '4.40', 3210, 'Bestseller', 64,
     '120Hz AMOLED display, 50MP OIS camera and 67W fast charging.', '01.png'),
    ('phones', 'Pulse Lite 5G', 'Zentech', '12499.00', '14999.00', 17, '4.20', 5410, '', 128,
     'Budget 5G phone with a 5000mAh battery and clean stock Android.', '02.png'),
    ('phones', 'Nova Ultra 5G', 'Nexon', '27999.00', '32999.00', 15, '4.50', 1876, 'New', 47,
     'Flagship-grade camera system with 4K video and wireless charging.', '03.png'),
    ('phones', 'MiniGo Compact Phone', 'Quip', '6999.00', '8999.00', 22, '4.00', 942, '', 85,
     'Pocket-sized 5.5-inch phone perfect as a lightweight secondary device.', '04.png'),
    # ── Audio & Headphones ───────────────────────────────────────────────
    ('audio', 'PulseBuds Pro ANC Earbuds', 'Soniq', '2499.00', '4999.00', 50, '4.30', 8421, 'Bestseller', 150,
     'True wireless earbuds with active noise cancellation and 32-hour playback.', '01.png'),
    ('audio', 'BoomBox Go Bluetooth Speaker', 'Soniq', '1799.00', '2999.00', 40, '4.20', 3150, '', 92,
     'IPX7 waterproof speaker with deep bass and 18-hour battery.', '02.png'),
    ('audio', 'StudioMax Over-Ear Headphones', 'Auria', '3499.00', '5999.00', 42, '4.50', 2210, 'Bestseller', 58,
     'Closed-back over-ear headphones tuned for studio-accurate sound.', '03.png'),
    ('audio', 'AirNeck Neckband Earphones', 'Auria', '999.00', '1799.00', 44, '4.10', 4530, '', 175,
     'Magnetic neckband earphones with low-latency gaming mode.', '04.png'),
    # ── Monitors & Displays ──────────────────────────────────────────────
    ('monitors', 'VistaView 27" QHD Monitor', 'Vistara', '15499.00', '19999.00', 23, '4.50', 967, 'Bestseller', 31,
     '27-inch QHD IPS monitor with 99% sRGB coverage and slim bezels.', '01.png'),
    ('monitors', 'UltraWide 34" Curved Display', 'Vistara', '32999.00', '44999.00', 27, '4.60', 431, 'Premium', 12,
     '34-inch 100Hz ultrawide curved panel that replaces dual-monitor setups.', '02.png'),
    ('monitors', 'ProArt 24" Colour-Accurate Monitor', 'Pixelon', '21499.00', '26999.00', 20, '4.40', 289, '', 19,
     'Factory-calibrated 24-inch display made for photo and video editing.', '03.png'),
    ('monitors', 'Vortex 25" 165Hz Gaming Monitor', 'Vexar', '16999.00', '22999.00', 26, '4.50', 1122, 'New', 26,
     'Fast IPS gaming monitor with 1ms response and adaptive sync.', '04.png'),
    # ── Networking ───────────────────────────────────────────────────────
    ('networking', 'MeshNet AX3000 WiFi 6 Router', 'Netora', '4999.00', '7999.00', 38, '4.40', 1520, 'Bestseller', 40,
     'Dual-band WiFi 6 mesh router covering up to 2500 sq. ft.', '01.png'),
    ('networking', 'PowerLink 8-Port Gigabit Switch', 'Netora', '1499.00', '2299.00', 35, '4.30', 860, '', 66,
     'Fanless plug-and-play gigabit switch with metal housing.', '02.png'),
    ('networking', 'RangeXt AC1200 Extender', 'Signalift', '1099.00', '1899.00', 42, '4.00', 1345, '', 74,
     'Dual-band extender that kills dead zones with one-touch WPS setup.', '03.png'),
    ('networking', 'SecureCam WiFi Smart Camera', 'Watchly', '2499.00', '3999.00', 38, '4.20', 987, 'New', 55,
     '1080p indoor camera with night vision, motion alerts and two-way audio.', '04.png'),
    # ── Gaming ───────────────────────────────────────────────────────────
    ('gaming', 'StrikeForce Mechanical Keyboard', 'Vexar', '3499.00', '5499.00', 36, '4.50', 2130, 'Bestseller', 48,
     'Hot-swappable RGB mechanical keyboard with per-key lighting effects.', '01.png'),
    ('gaming', 'GlideX Wireless Gaming Mouse', 'Vexar', '1599.00', '2499.00', 36, '4.40', 1760, '', 89,
     'Lightweight 16K-DPI wireless mouse with 70-hour battery.', '02.png'),
    ('gaming', 'RumbleCore Elite Controller', 'Playport', '4499.00', '5999.00', 25, '4.30', 954, 'New', 37,
     'Hall-effect sticks, remappable paddles and tri-mode connectivity.', '03.png'),
    ('gaming', 'VR Horizon Headset', 'Playport', '24999.00', '29999.00', 17, '4.40', 421, 'Premium', 9,
     'Standalone VR headset with pancake lenses and room-scale tracking.', '04.png'),
    # ── Smart Home ───────────────────────────────────────────────────────
    ('smart-home', 'HomeHub Smart Display 8"', 'Domia', '7999.00', '10999.00', 27, '4.30', 1230, 'New', 34,
     'Voice-first smart display that controls lights, cams and routines.', '01.png'),
    ('smart-home', 'BulbGenius Colour Smart Bulbs (2 pk)', 'Domia', '1299.00', '2199.00', 41, '4.20', 2890, '', 140,
     '16-million-colour WiFi bulbs with schedules and app control.', '02.png'),
    ('smart-home', 'Sentinel Doorbell Camera', 'Watchly', '5499.00', '7999.00', 31, '4.40', 1105, 'Bestseller', 42,
     '2K wired/wireless video doorbell with person detection.', '03.png'),
    ('smart-home', 'CleanSweep Robot Vacuum', 'Dustbot', '15999.00', '24999.00', 36, '4.20', 754, '', 16,
     'LiDAR-navigation robot vacuum with app scheduling and auto-recharge.', '04.png'),
    # ── Accessories ──────────────────────────────────────────────────────
    ('accessories', 'VoltCore 20000mAh Power Bank', 'Ampere', '1699.00', '2999.00', 43, '4.20', 3150, 'Bestseller', 118,
     '22.5W PD power bank with dual USB ports and digital display.', '01.png'),
    ('accessories', 'Type-C Fast Cable 2m', 'Wirely', '299.00', '599.00', 50, '4.10', 6732, '', 260,
     'Braided 100W USB-C to USB-C cable rated for 20,000 bends.', '02.png'),
    ('accessories', 'GripStand Adjustable Phone Holder', 'Perch', '449.00', '799.00', 44, '4.00', 920, '', 130,
     'Aluminium desk stand with adjustable viewing angles.', '03.png'),
    ('accessories', 'ShieldGlass Protector (2 pk)', 'Wirely', '399.00', '699.00', 43, '4.30', 1540, '', 210,
     '9H tempered glass protectors with installation frames included.', '04.png'),
]

DEMO_USERS = [
    {'email': 'admin@rpd.store', 'password': 'Admin@1234', 'role': User.Role.ADMIN,
     'full_name': 'RPD Admin', 'phone_number': '9000000001'},
    {'email': 'priya@example.com', 'password': 'Customer@123', 'role': User.Role.CUSTOMER,
     'full_name': 'Priya Sharma', 'phone_number': '9000000002',
     'address': '42 Green Park, New Delhi 110016'},
]


def _load_font(size):
    for name in ('arialbd.ttf', 'arial.ttf'):
        try:
            return ImageFont.truetype(name, size)
        except OSError:
            continue
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def _render_fallback(name, brand):
    """Simple gradient tile used only when a bundled photo is missing."""
    size = 800
    base = Image.new('RGB', (size, size))
    px = base.load()
    c1, c2 = (55, 88, 160), (120, 170, 255)
    denom = size * 2
    for y in range(size):
        for x in range(size):
            t = (x + y) / denom
            px[x, y] = tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))
    draw = ImageDraw.Draw(base, 'RGBA')
    words = ''.join(ch if ch.isalnum() else ' ' for ch in name).split()
    initials = ''.join(w[0] for w in words[:2]).upper() or 'RP'
    font_big = _load_font(230)
    bbox = draw.textbbox((0, 0), initials, font=font_big)
    draw.text(((size - (bbox[2] - bbox[0])) / 2, size * 0.38), initials,
              font=font_big, fill=(255, 255, 255, 235))
    if brand:
        font_small = _load_font(44)
        bb = draw.textbbox((0, 0), brand.upper(), font=font_small)
        draw.text(((size - (bb[2] - bb[0])) / 2, size - 170),
                  brand.upper(), font=font_small, fill=(255, 255, 255, 200))
    buf = BytesIO()
    base.save(buf, 'JPEG', quality=88)
    buf.seek(0)
    return ContentFile(buf.read())


class Command(BaseCommand):
    help = 'Seed electronics categories/products using bundled photos.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--refresh-images',
            action='store_true',
            help='Re-copy product images even if they are already set.',
        )
        parser.add_argument(
            '--no-wipe',
            action='store_true',
            help='Keep existing products/categories instead of replacing the demo catalog.',
        )

    def handle(self, *args, **options):
        refresh_images = options['refresh_images']

        if not options['no_wipe']:
            self.stdout.write('Removing previous demo catalog…')
            tx_deleted, _ = StockTransaction.objects.all().delete()
            p_deleted, _ = Product.objects.all().delete()
            c_deleted, _ = Category.objects.all().delete()
            self.stdout.write(
                f'  removed {p_deleted} products, {c_deleted} categories, {tx_deleted} stock transactions'
            )

        self.stdout.write('Creating categories…')
        categories = {}
        for slug, (name, description) in CATEGORIES.items():
            cat, created = Category.objects.update_or_create(
                slug=slug,
                defaults={'name': name, 'description': description, 'is_active': True},
            )
            categories[slug] = cat
            self.stdout.write(f'  {"+" if created else "~"} {cat.name}')

        self.stdout.write('Creating products…')
        created_products = missing_photos = images_written = 0
        for (cat_slug, name, brand, price, original_price, discount, rating,
             reviews_count, badge, stock, description, image_file) in PRODUCTS:
            defaults = {
                'name': name,
                'brand': brand,
                'category': categories[cat_slug],
                'price': price,
                'original_price': original_price,
                'discount': discount,
                'rating': rating,
                'reviews_count': reviews_count,
                'badge': badge,
                'stock': stock,
                'status': Product.Status.ACTIVE,
                'description': description,
            }
            sku = f'{cat_slug.upper()[:4]}-{slugify(name)[:20].upper()}'
            product, created = Product.objects.update_or_create(sku=sku, defaults=defaults)

            needs_image = refresh_images or not product.image
            if needs_image:
                src = IMG_ROOT / CATEGORY_IMG_FOLDERS[cat_slug] / image_file
                if src.exists():
                    product.image.save(
                        f'{slugify(name)}.png',
                        ContentFile(src.read_bytes()),
                        save=False,
                    )
                    product.save(update_fields=['image'])
                    images_written += 1
                else:
                    self.stdout.write(self.style.WARNING(
                        f'  missing photo for {name}: {src}'
                    ))
                    product.image.save(
                        f'{slugify(name)}.jpg',
                        _render_fallback(name, brand),
                        save=False,
                    )
                    product.save(update_fields=['image'])
                    missing_photos += 1

            created_products += int(created)

        self.stdout.write(f'  products created: {created_products}')
        self.stdout.write(f'  images attached: {images_written} ({missing_photos} fallback tiles)')

        self.stdout.write('Ensuring demo users…')
        for spec in DEMO_USERS:
            user, created = User.objects.get_or_create(
                email=spec['email'],
                defaults={
                    'role': spec['role'],
                    'full_name': spec['full_name'],
                    'phone_number': spec.get('phone_number', ''),
                    'address': spec.get('address', ''),
                },
            )
            if created:
                user.set_password(spec['password'])
                user.save(update_fields=['password'])
                self.stdout.write(self.style.SUCCESS(
                    f'  created {spec["role"]}: {spec["email"]} / {spec["password"]}'
                ))
            else:
                self.stdout.write(f'  exists: {spec["email"]}')

        self.stdout.write(self.style.SUCCESS(
            f'Done — {Category.objects.count()} categories, '
            f'{Product.objects.count()} products in database.'
        ))
