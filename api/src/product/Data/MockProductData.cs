using ProductStoreApi.Models;

namespace ProductStoreApi.Data;

public static class MockProductData
{
    public static readonly List<Product> Products = new()
    {
        new Product
        {
            Id = 1,
            Name = "MacBook Pro 16\"",
            SKU = "MBP16-M3PRO-512",
            Brand = "Apple",
            Category = "Laptops",
            Description = "The MacBook Pro 16\" with M3 Pro chip delivers exceptional performance for demanding workflows. Features a stunning Liquid Retina XDR display, 18-hour battery life, and a unified memory architecture.",
            Price = 2499.00m,
            ImageUrl = "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
            Stock = 15,
            Rating = 4.9,
            ReviewCount = 2341
        },
        new Product
        {
            Id = 2,
            Name = "Sony WH-1000XM5",
            SKU = "WH1000XM5-BLK",
            Brand = "Sony",
            Category = "Headphones",
            Description = "Industry-leading noise canceling headphones with auto noise canceling optimizer, precise voice pickup technology, and up to 30-hour battery life. Crystal clear hands-free calling.",
            Price = 349.99m,
            ImageUrl = "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
            Stock = 42,
            Rating = 4.8,
            ReviewCount = 5621
        },
        new Product
        {
            Id = 3,
            Name = "Samsung Galaxy S25 Ultra",
            SKU = "SGS25U-256-TIT",
            Brand = "Samsung",
            Category = "Smartphones",
            Description = "The Galaxy S25 Ultra features a 200MP camera system, Snapdragon 8 Elite processor, built-in S Pen, and a 6.9\" Dynamic AMOLED 2X display. The ultimate smartphone experience.",
            Price = 1299.99m,
            ImageUrl = "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
            Stock = 30,
            Rating = 4.7,
            ReviewCount = 3892
        },
        new Product
        {
            Id = 4,
            Name = "Dell UltraSharp 27 4K Monitor",
            SKU = "U2723DE-4K",
            Brand = "Dell",
            Category = "Monitors",
            Description = "27-inch 4K IPS Black monitor with ComfortView Plus technology, Thunderbolt 4 connectivity, and factory-calibrated color accuracy. Perfect for creative professionals.",
            Price = 699.99m,
            ImageUrl = "https://images.unsplash.com/photo-1527443224154-c4a573d4ba28?w=600&q=80",
            Stock = 20,
            Rating = 4.6,
            ReviewCount = 1247
        },
        new Product
        {
            Id = 5,
            Name = "Logitech MX Master 3S",
            SKU = "LGT-MXM3S-GRY",
            Brand = "Logitech",
            Category = "Peripherals",
            Description = "The MX Master 3S is the most advanced master series mouse yet. Featuring an 8,000 DPI sensor, quiet clicks, ultra-fast MagSpeed electromagnetic scrolling, and multi-device connectivity.",
            Price = 99.99m,
            ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
            Stock = 75,
            Rating = 4.8,
            ReviewCount = 8934
        },
        new Product
        {
            Id = 6,
            Name = "iPad Pro 13\" M4",
            SKU = "IPADPRO13-M4-256",
            Brand = "Apple",
            Category = "Tablets",
            Description = "The iPad Pro 13\" with M4 chip is impossibly thin at just 5.1mm and features the Ultra Retina XDR OLED display with nano-texture glass option. The most advanced iPad ever made.",
            Price = 1299.00m,
            ImageUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
            Stock = 22,
            Rating = 4.7,
            ReviewCount = 1834
        },
        new Product
        {
            Id = 7,
            Name = "ASUS ROG Strix G16",
            SKU = "ROG-G16-RTX4090",
            Brand = "ASUS",
            Category = "Laptops",
            Description = "High-performance gaming laptop with NVIDIA GeForce RTX 4090, Intel Core i9-14900HX, 32GB DDR5 RAM, and a 16\" QHD+ 240Hz display. Dominate every game.",
            Price = 2999.00m,
            ImageUrl = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
            Stock = 8,
            Rating = 4.6,
            ReviewCount = 723
        },
        new Product
        {
            Id = 8,
            Name = "Apple AirPods Pro 2",
            SKU = "APP2-USB-C",
            Brand = "Apple",
            Category = "Headphones",
            Description = "AirPods Pro 2 with USB-C feature next-level Active Noise Cancellation, Transparency mode, Adaptive Audio, and Vision Pro Spatial Audio. Up to 30 hours total listening time.",
            Price = 249.00m,
            ImageUrl = "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80",
            Stock = 55,
            Rating = 4.7,
            ReviewCount = 12045
        },
        new Product
        {
            Id = 9,
            Name = "LG OLED C4 55\" TV",
            SKU = "LG-OLED55C4-2024",
            Brand = "LG",
            Category = "TVs",
            Description = "LG OLED C4 with α9 AI Processor Gen7, Brightness Booster, 4K 144Hz gaming performance, and NVIDIA G-Sync support. The best OLED TV for movies and gaming.",
            Price = 1399.99m,
            ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f4834f?w=600&q=80",
            Stock = 12,
            Rating = 4.8,
            ReviewCount = 2156
        },
        new Product
        {
            Id = 10,
            Name = "Keychron Q1 Pro",
            SKU = "KCQ1PRO-QMK-RGB",
            Brand = "Keychron",
            Category = "Peripherals",
            Description = "A fully customizable 75% layout wireless mechanical keyboard with QMK/VIA support, hot-swappable PCB, double gasket design, and CNC machined aluminum body.",
            Price = 199.99m,
            ImageUrl = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
            Stock = 35,
            Rating = 4.7,
            ReviewCount = 2890
        },
        new Product
        {
            Id = 11,
            Name = "Google Pixel 9 Pro",
            SKU = "GGL-PXL9PRO-256",
            Brand = "Google",
            Category = "Smartphones",
            Description = "Pixel 9 Pro with the new Gemini AI assistant, a 50MP triple camera system, Tensor G4 chip, and a 6.3\" Super Actua OLED display. Pure Android, reimagined.",
            Price = 999.99m,
            ImageUrl = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
            Stock = 28,
            Rating = 4.5,
            ReviewCount = 1567
        },
        new Product
        {
            Id = 12,
            Name = "WD Black SN850X 2TB",
            SKU = "WD-SN850X-2TB-M2",
            Brand = "WD",
            Category = "Storage",
            Description = "PCIe Gen 4 NVMe SSD with read speeds up to 7,300 MB/s and 1TB game storage. Optimized for PS5 and PC gaming with an optional heatsink design.",
            Price = 149.99m,
            ImageUrl = "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80",
            Stock = 60,
            Rating = 4.8,
            ReviewCount = 4231
        },
        new Product
        {
            Id = 13,
            Name = "Razer DeathAdder V3 Pro",
            SKU = "RZR-DAV3PRO-BLK",
            Brand = "Razer",
            Category = "Peripherals",
            Description = "The most ergonomic wireless gaming mouse with 30K DPI Focus Pro sensor, 90-hour battery life, and an ultra-lightweight 64g design. Built for FPS excellence.",
            Price = 149.99m,
            ImageUrl = "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80",
            Stock = 48,
            Rating = 4.6,
            ReviewCount = 3102
        },
        new Product
        {
            Id = 14,
            Name = "Elgato Stream Deck MK.2",
            SKU = "ELG-SDMK2-BLK",
            Brand = "Elgato",
            Category = "Accessories",
            Description = "15 customizable LCD keys to control streaming software, launch media, adjust audio, and trigger scenes. One-tap access to everything you need to go live.",
            Price = 149.99m,
            ImageUrl = "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600&q=80",
            Stock = 33,
            Rating = 4.7,
            ReviewCount = 5678
        },
        new Product
        {
            Id = 15,
            Name = "Rode NT-USB+ Microphone",
            SKU = "RODE-NTUSBPLUS",
            Brand = "Rode",
            Category = "Accessories",
            Description = "Professional USB microphone with an internal audio interface, headphone amp, and real-time monitoring. Ultra-low noise floor and broadcast-quality audio for podcasting and streaming.",
            Price = 169.00m,
            ImageUrl = "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=600&q=80",
            Stock = 27,
            Rating = 4.8,
            ReviewCount = 2341
        },
        new Product
        {
            Id = 16,
            Name = "NVIDIA GeForce RTX 4070 Super",
            SKU = "NV-RTX4070S-12G",
            Brand = "NVIDIA",
            Category = "Graphics Cards",
            Description = "The GeForce RTX 4070 Super offers exceptional 1440p gaming performance with 12GB GDDR6X VRAM, DLSS 3.5, and hardware ray tracing. The sweet spot for high-performance gaming.",
            Price = 599.99m,
            ImageUrl = "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80",
            Stock = 10,
            Rating = 4.7,
            ReviewCount = 1893
        },
        new Product
        {
            Id = 17,
            Name = "Anker 733 Power Bank",
            SKU = "ANK-733-65W-GRN",
            Brand = "Anker",
            Category = "Accessories",
            Description = "3-in-1 GaNPrime power bank with 65W output, 10,000mAh capacity, and a built-in charging base. Charge your laptop, phone, and earbuds simultaneously.",
            Price = 89.99m,
            ImageUrl = "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
            Stock = 82,
            Rating = 4.5,
            ReviewCount = 6712
        },
        new Product
        {
            Id = 18,
            Name = "Corsair Vengeance DDR5 32GB",
            SKU = "CRS-VNG-32GB-6000",
            Brand = "Corsair",
            Category = "Memory",
            Description = "32GB (2x16GB) DDR5 RAM kit running at 6000MHz CL30 with Intel XMP 3.0 support and Corsair iCUE RGB lighting. Maximize your system's potential.",
            Price = 129.99m,
            ImageUrl = "https://images.unsplash.com/photo-1562976540-1502c2145851?w=600&q=80",
            Stock = 45,
            Rating = 4.6,
            ReviewCount = 2134
        },
        new Product
        {
            Id = 19,
            Name = "Bose QuietComfort 45",
            SKU = "BOSE-QC45-WHT",
            Brand = "Bose",
            Category = "Headphones",
            Description = "QuietComfort 45 headphones deliver world-class noise cancellation, TriPort acoustic architecture, and up to 24-hour battery life. Hear only what you want to hear.",
            Price = 279.00m,
            ImageUrl = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
            Stock = 38,
            Rating = 4.6,
            ReviewCount = 7823
        },
        new Product
        {
            Id = 20,
            Name = "Microsoft Surface Pro 11",
            SKU = "MSFT-SPR11-SLV-256",
            Brand = "Microsoft",
            Category = "Tablets",
            Description = "Surface Pro 11 with Snapdragon X Elite, up to 22 hours of battery life, a stunning 13\" PixelSense Flow display, and Copilot+ AI features. The most versatile 2-in-1.",
            Price = 1299.00m,
            ImageUrl = "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
            Stock = 18,
            Rating = 4.5,
            ReviewCount = 987
        },
        new Product
        {
            Id = 21,
            Name = "Jabra Evolve2 85",
            SKU = "JBR-EV285-UC-BLK",
            Brand = "Jabra",
            Category = "Headphones",
            Description = "Professional wireless headset with 8 microphone ANC, 37-hour battery life, and Jabra Advanced ANC. Engineered for the most demanding professional environments.",
            Price = 449.99m,
            ImageUrl = "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&q=80",
            Stock = 0,
            Rating = 4.5,
            ReviewCount = 1234
        },
        new Product
        {
            Id = 22,
            Name = "SteelSeries Arctis Nova Pro",
            SKU = "SS-ARTNP-PC-BLK",
            Brand = "SteelSeries",
            Category = "Headphones",
            Description = "Premium gaming headset with hot-swappable dual batteries, Active Noise Cancellation, and hi-fi audio with 360° Spatial Audio. Pairs with GameDAC Gen 2.",
            Price = 249.99m,
            ImageUrl = "https://images.unsplash.com/photo-1599669454699-248893623440?w=600&q=80",
            Stock = 22,
            Rating = 4.7,
            ReviewCount = 3012
        },
        new Product
        {
            Id = 23,
            Name = "Elgato 4K60 Pro MK.2",
            SKU = "ELG-4K60PRO-MK2",
            Brand = "Elgato",
            Category = "Accessories",
            Description = "Internal PCIe capture card for 4K60 HDR10 capture, VRR support, and ultra-low latency technology. The gold standard for professional content creation.",
            Price = 199.99m,
            ImageUrl = "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&q=80",
            Stock = 0,
            Rating = 4.6,
            ReviewCount = 1876
        },
        new Product
        {
            Id = 24,
            Name = "Xiaomi 14 Ultra",
            SKU = "XMI-14U-16-512-BLK",
            Brand = "Xiaomi",
            Category = "Smartphones",
            Description = "The Xiaomi 14 Ultra features a Leica Summilux professional quad-camera system with a 1-inch type main sensor, Snapdragon 8 Gen 3, and 5000mAh 90W wireless charging.",
            Price = 1099.00m,
            ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
            Stock = 14,
            Rating = 4.7,
            ReviewCount = 892
        },
        new Product
        {
            Id = 25,
            Name = "Synology DiskStation DS923+",
            SKU = "SYN-DS923PLUS",
            Brand = "Synology",
            Category = "Storage",
            Description = "4-bay NAS server powered by AMD Ryzen R1600 dual-core, expandable to 10GbE, and PCIe expansion for SSD caching. Perfect for home office and small business.",
            Price = 599.99m,
            ImageUrl = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
            Stock = 7,
            Rating = 4.8,
            ReviewCount = 567
        },
    };

    public static IEnumerable<string> GetCategories() =>
        Products.Select(p => p.Category).Distinct().Order();

    public static IEnumerable<string> GetBrands() =>
        Products.Select(p => p.Brand).Distinct().Order();
}
