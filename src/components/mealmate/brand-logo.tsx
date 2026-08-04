import { Image } from 'expo-image';

type BrandLogoProps = {
  width?: number;
};

const LOGO_ASPECT_RATIO = 1120 / 440;

export function BrandLogo({ width = 140 }: BrandLogoProps) {
  const height = width / LOGO_ASPECT_RATIO;

  return (
    <Image
      accessibilityLabel="Tably"
      contentFit="contain"
      source={require('../../../assets/images/tably-logo.png')}
      style={{ height, width }}
    />
  );
}
