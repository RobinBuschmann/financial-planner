import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./formContext.ts";
import { SubscribeButton } from "./SubscribeButton.tsx";
import TextField from "./TextField.tsx";
import Select from "./Select.tsx";

export const { useAppForm: useForm } = createFormHook({
  fieldComponents: {
    TextField,
    Select,
  },
  formComponents: {
    SubscribeButton,
  },
  formContext,
  fieldContext,
});
