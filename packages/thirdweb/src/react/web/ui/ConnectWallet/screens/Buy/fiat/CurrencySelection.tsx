import styled from "@emotion/styled";
import { useCustomTheme } from "../../../../../../core/design-system/CustomThemeProvider.js";
import { spacing } from "../../../../../../core/design-system/index.js";
import { Container, Line, ModalHeader } from "../../../../components/basic.js";
import { Button } from "../../../../components/buttons.js";
import { Spacer } from "../../../../components/Spacer.js";
import { Text } from "../../../../components/text.js";
import { type CurrencyMeta, currencies, getFiatIcon } from "./currencies.js";

export function CurrencySelection(props: {
  onSelect: (currency: CurrencyMeta) => void;
  onBack: () => void;
}) {
  return (
    <Container>
      <Container p="lg">
        <ModalHeader onBack={props.onBack} title="Pay with" />
      </Container>

      <Line />
      <Spacer y="lg" />

      <Container flex="column" gap="xs" px="lg">
        {currencies.map((c) => {
          return (
            <SelectCurrencyButton
              fullWidth
              gap="sm"
              key={c.shorthand}
              onClick={() => props.onSelect(c)}
              variant="secondary"
            >
              {getFiatIcon(c, "lg")}
              <Container flex="column" gap="xxs">
                <Text color="primaryText">{c.shorthand}</Text>
                <Text size="sm">{c.name}</Text>
              </Container>
            </SelectCurrencyButton>
          );
        })}
      </Container>

      <Spacer y="lg" />
    </Container>
  );
}

const SelectCurrencyButton = /* @__PURE__ */ styled(Button)(() => {
  const theme = useCustomTheme();
  return {
    "&:hover": {
      background: theme.colors.secondaryButtonBg,
      transform: "scale(1.01)",
    },
    background: theme.colors.tertiaryBg,
    gap: spacing.sm,
    justifyContent: "flex-start",
    padding: spacing.sm,
    transition: "background 200ms ease, transform 150ms ease",
  };
});
