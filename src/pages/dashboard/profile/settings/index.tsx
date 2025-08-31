import type { HighestEducationalExperience as HighestEducationalExperienceType } from "@prisma/client";
import { NextSeo } from "next-seo";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import BackgroundPatternTransparent from "~/assets/background-pattern-transparent.webp";
import { Avatar, BackButton, DashboardLayout } from "~/components";
import {
  Button,
  ImageUploader,
  Input,
  Loader,
  MultiValueInput,
  Select,
  toast,
  type SelectItem,
  LoaderSize,
} from "~/components/ui";
import { HIGHEST_EDUCATIONAL_EXPERIENCES } from "~/constants/highest-educational-experiences";
import { api } from "~/utils/api";

export default function ProfileSettings() {
  const utils = api.useContext();
  const { data: user, isLoading: isUserLoading } = api.me.useQuery(
    { select: { highestEducationalExperience: true, interestedTopics: true } },
    {
      onSuccess(data) {
        setImageSrc(data.avatar);
        data.name && setName(data.name);
        setHighestEducationalExperience(
          HIGHEST_EDUCATIONAL_EXPERIENCES.find((v) => v.name === data.highestEducationalExperience)
        );
        setInterestedTopics(data.interestedTopics ?? []);
      },
    }
  );
  const { mutate: updateProfile, isLoading: updateProfileInProgress } = api.profile.update.useMutation({
    onSuccess() {
      toast("Your user profile has been updated successfully.", "success");
      void utils.me.refetch();
    },
  });
  const [imageSrc, setImageSrc] = useState<string>("");
  const [name, setName] = useState("");
  const [highestEducationalExperience, setHighestEducationalExperience] =
    useState<SelectItem<HighestEducationalExperienceType>>();
  const [interestedTopics, setInterestedTopics] = useState<string[]>([]);
  const [interestedTopicsInputFieldValue, setInterestedTopicsInputFieldValue] = useState("");
  const [savingField, setSavingField] = useState<
    "name" | "highestEducationalExperience" | "interestedTopics" | null
  >(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const onNameChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  }, []);

  const saveName = useCallback(() => {
    setSavingField("name");
    void updateProfile({ name });
  }, [name, updateProfile]);
  const saveHighestEducationalExperience = useCallback(() => {
    if (!highestEducationalExperience?.name) {
      return;
    }

    setSavingField("highestEducationalExperience");
    void updateProfile({ highestEducationalExperience: highestEducationalExperience.name });
  }, [highestEducationalExperience?.name, updateProfile]);
  const saveInterestedTopics = useCallback(() => {
    setSavingField("interestedTopics");
    void updateProfile({ interestedTopics });
  }, [interestedTopics, updateProfile]);

  return (
    <>
      <NextSeo title="Settings | TeachMe" />
      <DashboardLayout>
        <div
          className="relative flex h-full items-start bg-white bg-opacity-25 bg-cover bg-center bg-no-repeat px-4 bg-blend-color"
          style={{ backgroundImage: `url(${BackgroundPatternTransparent.src})` }}>
          <BackButton className="relative z-10 mt-6" />
          <div className="mx-8 flex h-full flex-auto flex-col items-center overflow-hidden pt-8">
            <div className="mx-8 mb-4 self-start">
              <span className="text-3xl underline decoration-primary-500">Settings</span>
            </div>
            <div className="relative flex w-full flex-auto overflow-hidden rounded-b-sm rounded-t-3xl bg-gray-50 bg-opacity-80 px-12 py-12 shadow md:px-24">
              {!user || isUserLoading ? (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Loader size={LoaderSize.Five} />
                </div>
              ) : (
                <div className="mx-auto max-w-5xl flex-auto space-y-6 overflow-y-auto">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-lg bg-white px-10 py-6 shadow">
                    <span className="flex items-center space-x-4">
                      <span>Profile picture</span>
                      {user && <Avatar alt={user.name || "You"} size="lg" imageSrc={imageSrc} />}
                    </span>
                    <span className="flex items-center space-x-2">
                      <input
                        ref={avatarRef}
                        type="hidden"
                        name="avatar"
                        id="avatar"
                        placeholder="URL"
                        className="mt-1 block w-full rounded-sm border px-3 py-2 text-sm focus:border-gray-800 focus:outline-none"
                        defaultValue={imageSrc}
                      />
                      <ImageUploader
                        target="avatar"
                        buttonMsg="Update profile picture"
                        handleAvatarChange={(newAvatar) => {
                          console.log(avatarRef, newAvatar);
                          if (!avatarRef.current) {
                            return;
                          }

                          avatarRef.current.value = newAvatar;
                          // eslint-disable-next-line @typescript-eslint/unbound-method
                          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype,
                            "value"
                          )?.set;
                          nativeInputValueSetter?.call(avatarRef.current, newAvatar);
                          const ev2 = new Event("input", { bubbles: true });
                          avatarRef.current.dispatchEvent(ev2);
                          void updateProfile({ avatar: avatarRef.current.value });
                          setImageSrc(newAvatar);
                        }}
                        imageSrc={imageSrc}
                      />
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-lg bg-white px-10 py-6 shadow">
                    <span className="flex flex-auto items-center space-x-4">
                      <span>Name</span>
                      <Input
                        type="text"
                        value={name}
                        onChange={onNameChange}
                        className="py-1"
                        wrapperClassName="flex-auto"
                      />
                    </span>
                    <Button
                      size="xs"
                      className="px-6"
                      onClick={saveName}
                      loading={savingField === "name" && updateProfileInProgress}
                      disabled={!name.trim()}>
                      Save
                    </Button>
                  </div>
                  <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-lg bg-white px-10 py-6 shadow">
                    <span className="flex flex-auto items-center space-x-4 overflow-x-auto">
                      <span>Highest Educational Experience</span>
                      <Select
                        state={[highestEducationalExperience, setHighestEducationalExperience]}
                        items={HIGHEST_EDUCATIONAL_EXPERIENCES}
                        className="text-lg"
                        wrapperClassName="space-y-4 static flex-auto"
                        optionsListClassName="left-0"
                      />
                    </span>
                    <Button
                      size="xs"
                      className="px-6"
                      onClick={saveHighestEducationalExperience}
                      loading={savingField === "highestEducationalExperience" && updateProfileInProgress}
                      disabled={!highestEducationalExperience?.name}>
                      Save
                    </Button>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 rounded-lg bg-white px-10 py-6 shadow">
                    <span className="flex flex-auto items-center space-x-4">
                      <span>Interested Topics</span>
                      <MultiValueInput
                        values={interestedTopics}
                        setValues={setInterestedTopics}
                        valueOnInputField={interestedTopicsInputFieldValue}
                        setValueOnInputField={setInterestedTopicsInputFieldValue}
                        placeholder="Radiation techniques, Nuclear fusion, Isomorphism"
                        className="text-lg"
                        wrapperClassName="space-y-1 flex-auto"
                      />
                    </span>
                    <Button
                      size="xs"
                      className="px-6"
                      onClick={saveInterestedTopics}
                      loading={savingField === "interestedTopics" && updateProfileInProgress}>
                      Save
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}
