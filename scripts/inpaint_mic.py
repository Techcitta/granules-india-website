import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt, gaussian_filter

def inpaint_fast():
    im = Image.open('public/assets/company/test_crop_4k.png').convert('RGB')
    arr = np.array(im, dtype=np.float32)
    h, w, _ = arr.shape
    print(f'Original 4K crop shape: {arr.shape}')

    # Subregion covering mic: X in [1500, 2300], Y in [500, 1500]
    x_min, x_max = 1500, 2300
    y_min, y_max = 500, 1500
    
    sub = arr[y_min:y_max, x_min:x_max].copy()
    sh, sw, _ = sub.shape
    
    y_grid, x_grid = np.ogrid[:sh, :sw]
    # Coordinates in sub:
    # mic ball center was (1925, 820) -> in sub: (1925 - 1500, 820 - 500) = (425, 320)
    # stem was from (1925, 820) to (1670, 1500) -> in sub: (425, 320) to (170, 1000)
    
    ball_mask = ((x_grid - 425)**2 / 230**2 + (y_grid - 320)**2 / 230**2) <= 1.0
    
    p1 = np.array([425.0, 320.0])
    p2 = np.array([170.0, 1000.0])
    v = p2 - p1
    v_len2 = np.sum(v**2)
    px = x_grid - p1[0]
    py = y_grid - p1[1]
    t = np.clip((px * v[0] + py * v[1]) / v_len2, 0.0, 1.0)
    dist_to_stem = np.sqrt((px - t * v[0])**2 + (py - t * v[1])**2)
    stem_mask = dist_to_stem <= 85
    
    mic_mask = ball_mask | stem_mask
    dilated = distance_transform_edt(~mic_mask) < 18
    
    # Protect Dr. Prasad's skin, shirt and suit
    # In sub: x > 600
    face_protect = (x_grid > 580) & (y_grid < 350)
    shirt_protect = (x_grid > 620) & (sub[:, :, 0] > 110) & (sub[:, :, 1] > 110)
    suit_protect = (x_grid > 650) & (y_grid >= 350)
    
    final_mask = dilated & ~face_protect & ~shirt_protect & ~suit_protect
    print(f'Subregion mask pixels: {np.sum(final_mask)}')
    
    # Perform fast smooth inpainting:
    # The stage ring on the left (x < 300) provides the smooth white/cyan gradient
    for c in range(3):
        ch = sub[:, :, c]
        valid = np.where(~final_mask, ch, 0)
        weight = np.where(~final_mask, 1.0, 0.0)
        
        # Smooth interpolation using multi-scale gaussian
        b_val = gaussian_filter(valid, sigma=35)
        b_wt = gaussian_filter(weight, sigma=35)
        smooth = b_val / np.maximum(b_wt, 1e-5)
        
        ch[final_mask] = smooth[final_mask]
        sub[:, :, c] = ch
        
    # Subtle film grain
    noise = np.random.normal(0, 1.5, sub.shape)
    sub = np.clip(sub + noise * final_mask[:, :, None], 0, 255)
    
    arr[y_min:y_max, x_min:x_max] = sub
    
    clean_img = Image.fromarray(arr.astype(np.uint8))
    
    # Save full 4K clean
    clean_img.save('public/assets/company/leadership-banner-clean.png')
    clean_img.save('public/assets/company/leadership-banner-clean.webp', quality=95)
    
    # Save 1920px width banner asset
    target_w = 1920
    target_h = int(h * target_w / w)
    banner_1920 = clean_img.resize((target_w, target_h), Image.Resampling.LANCZOS)
    banner_1920.save('public/assets/company/leadership-photo-banner.webp', quality=94)
    banner_1920.save('public/assets/company/leadership-photo-banner.png')
    
    # Also overwrite leadership-photo-4k.webp and leadership-photo-4k.png so any existing component uses it
    banner_1920.save('public/assets/company/leadership-photo-4k.webp', quality=94)
    banner_1920.save('public/assets/company/leadership-photo-4k.png')
    
    print(f'Successfully saved banner image: 1920x{target_h}')

if __name__ == '__main__':
    inpaint_fast()
