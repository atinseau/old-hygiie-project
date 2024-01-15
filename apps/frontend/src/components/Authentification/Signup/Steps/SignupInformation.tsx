import RadioInput from "@/components/Inputs/RadioInput";
import TextInput from "@/components/Inputs/TextInput";
import DateInput from "@/components/Inputs/DateInput";
import InformationCard from "@/components/Card/InformationCard";
import AuthFormContainer from "../../AuthFormContainer";
import { FormStepSubmitHandler, useFormStep } from "@/contexts/FormProvider/hooks/useFormStep";
import { useCallback } from "react";


export default function SignupInformation() {

  const { handleSubmit, formRef } = useFormStep()

  const onSubmit: FormStepSubmitHandler = useCallback(async (data) => {
    console.log(data)
    return false
  }, [])

  return <AuthFormContainer
    title="Lorem ipsum"
    variant="full"
  >
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <RadioInput
        label="Vous êtes :"
        subLabel="La réglementation du système de santé français nous oblige à vous demander cette information."
        isRequired
        orientation="horizontal"
        items={[
          { label: "Un Homme", value: "MALE" },
          { label: "Une femme", value: "FEMALE" },
        ]}
      />

      <div className="flex gap-6">
        <TextInput
          baseInputProps={{
            label: "Prénom : "
          }}
          placeholder="Votre prénom"
          isRequired
        />

        <TextInput
          baseInputProps={{
            label: "Nom :"
          }}
          placeholder="Votre nom"
          isRequired
        />
      </div>

      <div className="flex gap-6">
        <TextInput
          baseInputProps={{
            label: "Nom de naissance :"
          }}
          placeholder="Votre nom de naissance"
        />

        <DateInput
          baseInputProps={{
            label: "Date de naissance :"
          }}
          placeholder="DD/MM/YYYY"
          autoClose
          isRequired
        />
      </div>

      <TextInput
        baseInputProps={{
          label: "Lieu de naissance :"
        }}
        isRequired
        placeholder="Votre lieu de naissance"
      />
    </form>

    <InformationCard>
      <p>Les informations ci-dessus seront transmises au médecin lors des RDV</p>
    </InformationCard>
  </AuthFormContainer>

}