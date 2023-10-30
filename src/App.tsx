import React from "react";
import "./App.css";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  username: string;
  email: string;
  website: string;
  githubUrl: string;
  password: string;
  confirmPassword: string;
};

// Creating an object schema
const UserSchema: ZodType<FormData> = z
  .object({
    username: z
      .string()
      .min(2, { message: "Username is too short" })
      .max(20, { message: "Username is too long" }),
    email: z.string().email({ message: "Invalid email format" }),
    website: z.string().url({ message: "Invalid website URL" }),
    githubUrl: z
      .string()
      .url({ message: "Invalid Github URL" })
      .includes("github.com", { message: "Must be a GitHub URL" }),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  const submitData = (data: FormData) => {
    console.log("SUCCESS", data);
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(submitData)}>
        <h1>Zod React Form Example</h1>
        <input type="text" placeholder="Username" {...register("username")} />
        {errors.username && (
          <span className="error-message">{errors.username.message}</span>
        )}
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
        <input type="text" placeholder="Website" {...register("website")} />
        {errors.website && (
          <span className="error-message">{errors.website.message}</span>
        )}
        <input
          type="text"
          placeholder="Github URL"
          {...register("githubUrl")}
        />
        {errors.githubUrl && (
          <span className="error-message">{errors.githubUrl.message}</span>
        )}
        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
        <input
          type="password"
          placeholder="Confirm Password"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="error-message">
            {errors.confirmPassword.message}
          </span>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
