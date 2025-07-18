import { Flex, FormControl } from "@chakra-ui/react";
import { FormHelperText, FormLabel } from "chakra/form";
import { Select as ChakraSelect } from "chakra-react-select";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type { Team } from "@/api/team";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Account } from "@/hooks/useApi";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { PlanToCreditsRecord } from "./ApplyForOpCreditsModal";
import { applyOpSponsorship } from "./applyOpSponsorship";

interface FormSchema {
  firstname: string;
  lastname: string;
  thirdweb_account_id: string;
  plan_type: string;
  email: string;
  company: string;
  website: string;
  twitterhandle: string;
  superchain_verticals: string;
  superchain_chain: string;
  what_would_you_like_to_meet_about_: string;
}

interface ApplyForOpCreditsFormProps {
  onClose: () => void;
  plan: Team["billingPlan"];
  account: Account;
}

export const ApplyForOpCreditsForm: React.FC<ApplyForOpCreditsFormProps> = ({
  onClose,
  account,
  plan,
}) => {
  const [, setHasAppliedForOpGrant] = useLocalStorage(
    `appliedForOpGrant-${account?.id}`,
    false,
  );
  const transformedQueryData = useMemo(
    () => ({
      company: "",
      email: account?.email || "",
      firstname: "",
      lastname: "",
      plan_type: PlanToCreditsRecord[plan].plan,
      superchain_chain: "",
      superchain_verticals: "",
      thirdweb_account_id: account?.id || "",
      twitterhandle: "",
      website: "",
      what_would_you_like_to_meet_about_: "",
    }),
    [account, plan],
  );

  const form = useForm<FormSchema>({
    defaultValues: transformedQueryData,
    values: transformedQueryData,
  });

  const { onSuccess, onError } = useTxNotifications(
    "We have received your application and will notify you if you are selected.",
    "Something went wrong, please try again.",
  );

  return (
    <Flex
      as="form"
      direction="column"
      gap={4}
      onSubmit={form.handleSubmit(async (data) => {
        const fields = Object.keys(data).map((key) => ({
          name: key,
          // biome-ignore lint/suspicious/noExplicitAny: FIXME
          value: (data as any)[key],
        }));

        try {
          const response = await applyOpSponsorship({
            fields,
          });

          if (!response.ok) {
            throw new Error("Form submission failed");
          }

          onSuccess();
          onClose();
          setHasAppliedForOpGrant(true);

          form.reset();
        } catch (error) {
          onError(error);
        }
      })}
    >
      <Flex flexDir="column" gap={4}>
        <Flex gap={4}>
          <FormControl gap={6} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input {...form.register("firstname", { required: true })} />
          </FormControl>
          <FormControl gap={6} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input {...form.register("lastname", { required: true })} />
          </FormControl>
        </Flex>

        <FormControl gap={6} isRequired>
          <FormLabel>Company Name</FormLabel>
          <Input {...form.register("company", { required: true })} />
        </FormControl>

        <FormControl gap={6} isRequired>
          <FormLabel>Company Website</FormLabel>
          <Input type="url" {...form.register("website", { required: true })} />
          <FormHelperText>URL should start with https://</FormHelperText>
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Company Social Account</FormLabel>
          <Input
            type="url"
            {...form.register("twitterhandle", { required: true })}
          />
          <FormHelperText>URL should start with https://</FormHelperText>
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Industry</FormLabel>
          <ChakraSelect
            isRequired
            onChange={(value) => {
              if (value?.value) {
                form.setValue("superchain_verticals", value.value);
              }
            }}
            options={[
              "DAOs",
              "Education & Community",
              "Fandom & Rewards",
              "Gaming & Metaverse",
              "Infra & Dev Tools",
              "NFTs",
              "Payments & Finance (DeFi)",
              "Security & Identity",
              "Social",
              "Other",
            ].map((vertical) => ({
              label: vertical,
              value:
                vertical === "Payments & Finance (DeFi)" ? "DeFi" : vertical,
            }))}
            placeholder="Select industry"
          />
        </FormControl>
        <FormControl gap={6} isRequired>
          <FormLabel>Chain</FormLabel>
          <ChakraSelect
            isMulti
            isRequired
            onChange={(values) => {
              form.setValue(
                "superchain_chain",
                values.map(({ value }) => value).join(";"),
              );
            }}
            options={[
              "Optimism",
              "Base",
              "Zora",
              "Mode",
              "Frax",
              "Cyber",
              "Redstone",
              "Ancient8",
              "Donatuz",
              "Mantle",
              "Soneium",
              "Lisk",
              "Arena-Z",
              "Superseed",
              "Ink",
            ].map((chain) => ({
              label: chain === "Optimism" ? "OP Mainnet" : chain,
              value: chain,
            }))}
            placeholder="Select chains"
            selectedOptionStyle="check"
          />
        </FormControl>
        <FormControl gap={6}>
          <FormLabel>Tell us more about your project</FormLabel>
          <Textarea
            {...form.register("what_would_you_like_to_meet_about_")}
            placeholder="Tell us more about your project -- the more you share, the easier you make the approval process."
          />
          <FormHelperText>Minimum 150 characters recommended.</FormHelperText>
        </FormControl>
      </Flex>
      <div className="flex flex-row">
        <Button
          className="w-full"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? "Applying..." : "Apply now"}
        </Button>
      </div>
    </Flex>
  );
};
