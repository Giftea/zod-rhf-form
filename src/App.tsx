import React from "react";
import "./App.css";
import { z, ZodType } from "zod";
import { useForm } from "react-hook-form"; // Import the useForm hook
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = {
  username: string;
  email: string;
  DOB: Date;
  website: string;
  githubUrl: string;
  yearsOfExperience: number;
  role: string;
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
    DOB: z
      .date()
      .min(new Date("1900-01-01"), { message: "Too old" })
      .max(new Date(), { message: "Too young!" }),
    website: z.string().url({ message: "Invalid website URL" }),
    githubUrl: z
      .string()
      .url({ message: "Invalid GitHub URL" })
      .includes("github.com", { message: "Must be a GitHub URL" }),
    yearsOfExperience: z.number({
      required_error: "required field",
      invalid_type_error: "Years of Experience is required",
    }).min(1).max(10),
    role: z.string(z.enum(["developer", "designer", "other"])).min(1, { message: "Select a role"}),
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
    resolver: zodResolver(UserSchema), // Apply the zodResolver with your UserSchema
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
        <input type="Date" {...register("DOB", { valueAsDate: true })} />
        {errors.DOB && (
          <span className="error-message">{errors.DOB.message}</span>
        )}
        <input type="text" placeholder="Website" {...register("website")} />
        {errors.website && (
          <span className="error-message">{errors.website.message}</span>
        )}
        <input
          type="text"
          placeholder="GitHub URL"
          {...register("githubUrl")}
        />
        {errors.githubUrl && (
          <span className="error-message">{errors.githubUrl.message}</span>
        )}
        <input
          type="number"
          placeholder="Years of Experience (1 - 10)"
          {...register("yearsOfExperience", { valueAsNumber: true })}
        />
        {errors.yearsOfExperience && (
          <span className="error-message">
            {errors.yearsOfExperience.message}
          </span>
        )}
        <select id="role" {...register("role")}>
          <option value="">--Select Role--</option>
          <option value="developer">Software Developer</option>
          <option value="designer">UI/UX Designer</option>
          <option value="other">Other</option>
        </select>
        {errors.role && (
          <span className="error-message">{errors.role.message}</span>
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
