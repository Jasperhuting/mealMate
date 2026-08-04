import { Divider, HStack, Image, Rectangle, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  allowsTightening,
  clipShape,
  clipped,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  minimumScaleFactor,
  padding,
  resizable,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

export type MealPlanWidgetProps = {
  primaryLabel: string;
  primaryTitle: string;
  primaryImageUri?: string;
  secondaryLabel: string;
  secondaryTitle: string;
  secondaryImageUri?: string;
};

const HomeMealPlanWidget = (
  props: MealPlanWidgetProps,
  environment: WidgetEnvironment,
) => {
  'widget';

  if (environment.widgetFamily === 'systemSmall') {
    return (
      <ZStack
        alignment="leading"
        modifiers={[
          containerBackground(props.primaryImageUri ? '#18332A' : '#E8F0E9', 'widget'),
          frame({ maxWidth: Infinity, maxHeight: Infinity }),
          clipShape('containerRelativeShape'),
        ]}>
        {props.primaryImageUri && (
          <Image
            uiImage={props.primaryImageUri}
            modifiers={[
              resizable(),
              aspectRatio({ contentMode: 'fill' }),
              frame({ maxWidth: Infinity, maxHeight: Infinity }),
              clipped(),
            ]}
          />
        )}
        {props.primaryImageUri && (
          <Rectangle
            modifiers={[
              foregroundStyle({
                type: 'linearGradient',
                colors: ['#00000000', '#000000CC'],
                startPoint: { x: 0.5, y: 0 },
                endPoint: { x: 0.5, y: 1 },
              }),
              frame({ maxWidth: Infinity, maxHeight: Infinity }),
            ]}
          />
        )}
        <VStack
          alignment="leading"
          spacing={5}
          modifiers={[
            frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' }),
            padding({ all: 16 }),
          ]}>
          <Text
            modifiers={[
              font({ size: 11, weight: 'bold', design: 'rounded' }),
              foregroundStyle(props.primaryImageUri ? '#FFFFFF' : '#195C44'),
            ]}>
            {props.primaryLabel.toUpperCase()}
          </Text>
          <Spacer />
          <Text
            modifiers={[
              font({ size: 20, weight: 'bold', design: 'rounded' }),
              foregroundStyle(props.primaryImageUri ? '#FFFFFF' : '#18332A'),
              lineLimit(),
              minimumScaleFactor(0.55),
              allowsTightening(true),
            ]}>
            {props.primaryTitle}
          </Text>
          <Text
            modifiers={[
              font({ size: 11, weight: 'medium' }),
              foregroundStyle(props.primaryImageUri ? '#FFFFFFCC' : '#527064'),
            ]}>
            Op het menu
          </Text>
        </VStack>
      </ZStack>
    );
  }

  return (
    <VStack
      alignment="leading"
      spacing={6}
      modifiers={[
        containerBackground('#E8F0E9', 'widget'),
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' }),
        padding({ all: 12 }),
      ]}>
      <Text
        modifiers={[
          font({ size: 12, weight: 'bold', design: 'rounded' }),
          foregroundStyle('#195C44'),
        ]}>
        TABLY · OP HET MENU
      </Text>
      <HStack
        alignment="top"
        spacing={14}
        modifiers={[frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' })]}>
        <VStack
          alignment="leading"
          spacing={4}
          modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]}>
          {props.primaryImageUri && (
            <Image
              uiImage={props.primaryImageUri}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: 'fill' }),
                frame({ maxWidth: Infinity, height: 44 }),
                clipped(),
                clipShape('roundedRectangle', 9),
              ]}
            />
          )}
          <Text
            modifiers={[
              font({ size: 11, weight: 'semibold' }),
              foregroundStyle('#527064'),
            ]}>
            {props.primaryLabel}
          </Text>
          <Text
            modifiers={[
              font({ size: 15, weight: 'bold', design: 'rounded' }),
              foregroundStyle('#18332A'),
              lineLimit(),
              minimumScaleFactor(0.55),
              allowsTightening(true),
            ]}>
            {props.primaryTitle}
          </Text>
        </VStack>
        <Divider />
        <VStack
          alignment="leading"
          spacing={4}
          modifiers={[frame({ maxWidth: Infinity, alignment: 'leading' })]}>
          {props.secondaryImageUri && (
            <Image
              uiImage={props.secondaryImageUri}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: 'fill' }),
                frame({ maxWidth: Infinity, height: 44 }),
                clipped(),
                clipShape('roundedRectangle', 9),
              ]}
            />
          )}
          <Text
            modifiers={[
              font({ size: 11, weight: 'semibold' }),
              foregroundStyle('#527064'),
            ]}>
            {props.secondaryLabel}
          </Text>
          <Text
            modifiers={[
              font({ size: 15, weight: 'bold', design: 'rounded' }),
              foregroundStyle('#18332A'),
              lineLimit(),
              minimumScaleFactor(0.55),
              allowsTightening(true),
            ]}>
            {props.secondaryTitle}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default createWidget('HomeMealPlanWidget', HomeMealPlanWidget);
