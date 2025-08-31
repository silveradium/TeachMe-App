import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useState, type ChangeEvent, type FormEventHandler } from "react";
import { GoogleAuthButton } from "~/components";
import { Button, Checkbox, Input } from "~/components/ui";
import { EMAIL_REGEX, PASSWORD_REGEX } from "~/lib/auth/validations";
import { api } from "~/utils/api";

interface SignUpFormProps {
  isGoogleLoginEnabled: boolean;
}

export default function SignUpForm({ isGoogleLoginEnabled }: SignUpFormProps) {
  const router = useRouter();
  const { mutate: signUp, isLoading: signUpInProgress } = api.auth.signUp.useMutation({
    async onSuccess() {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/onboarding",
      });
      if (res?.url) {
        await router.push(res.url);
      }
    },
    onError() {
      resetFields();
    },
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const resetFields = useCallback(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();

      const newErrors = { ...errors };

      if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
        newErrors.email = true;
      } else {
        newErrors.email = false;
      }

      if (password !== confirmPassword) {
        newErrors.password = true;
        newErrors.confirmPassword = true;
      } else {
        newErrors.confirmPassword = false;

        if (!password.trim() || !PASSWORD_REGEX.test(password)) {
          newErrors.password = true;
        } else {
          newErrors.password = false;
        }
      }

      setErrors(newErrors);

      if (Object.values(newErrors).every((e) => !e)) {
        signUp({ email, password });
      }
    },
    [confirmPassword, email, errors, password, signUp]
  );

  const onEmailChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }, []);

  const onPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }, []);

  const onConfirmPasswordChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  }, []);

  return (
    <div className="space-y-6">
      {isGoogleLoginEnabled && (
        <div className="space-y-2">
          <GoogleAuthButton context="signUp" className="mx-auto" />
          <div className="text-center text-sm text-gray-600">or Sign up with Email</div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-8">
        <div className="space-y-4">
          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={email}
            onChange={onEmailChange}
          />
          <Input
            type={showPassword ? "text" : "password"}
            id="password "
            name="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
          />
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
          />
          <Checkbox
            field="show-password"
            checked={showPassword}
            onChange={(checked) => setShowPassword(checked)}
            className="w-fit">
            Show Password
          </Checkbox>
        </div>
        <Button type="submit" size="lg" className="self-end" loading={signUpInProgress}>
          Sign Up
        </Button>
      </form>
    </div>
  );
}
