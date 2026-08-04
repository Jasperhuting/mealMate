import { HStack, Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  allowsTightening,
  aspectRatio,
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

import type { MealPlanWidgetProps } from './HomeMealPlanWidget';

const LockScreenMealPlanWidget = (
  props: MealPlanWidgetProps,
  _environment: WidgetEnvironment,
) => {
  'widget';

  return (
    <HStack
      alignment="center"
      spacing={7}
      modifiers={[
        containerBackground('#00000000', 'widget'),
        frame({ maxWidth: Infinity, maxHeight: Infinity, alignment: 'leading' }),
        padding({ horizontal: 3, vertical: 2 }),
      ]}>
      {props.primaryImageUri && props.primaryTitle.length <= 38 && (
        <Image
          uiImage={props.primaryImageUri}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: 'fill' }),
            frame({ width: 36, height: 36 }),
            clipped(),
            clipShape('roundedRectangle', 8),
          ]}
        />
      )}
      <VStack alignment="leading" spacing={1}>
        <Text
          modifiers={[
            font({ size: 9, weight: 'semibold', design: 'rounded' }),
            foregroundStyle({ type: 'hierarchical', style: 'secondary' }),
          ]}>
          🍽 TABLY · {props.primaryLabel.toUpperCase()}
        </Text>
        <Text
          modifiers={[
            font({ size: 13, weight: 'bold', design: 'rounded' }),
            foregroundStyle({ type: 'hierarchical', style: 'primary' }),
            lineLimit(),
            minimumScaleFactor(0.5),
            allowsTightening(true),
          ]}>
          {props.primaryTitle}
        </Text>
      </VStack>
    </HStack>
  );
};

export default createWidget('LockScreenMealPlanWidget', LockScreenMealPlanWidget);
