import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { UserAuth } from "@/context/AuthContext";
import { Helmet } from "react-helmet";

export default function SignInPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      toast.success(t("SignInPage.successMessage"));
      navigate("/Account");
    } catch (e) {
      setError(e.message);
      toast.error(t("SignInPage.errorMessage"));
    }
  };

  return (
    <>
      <Helmet>
        <title>Coinim | {t("SignInPage.title")}</title>
      </Helmet>
      <div className="fluid">
        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2">
          <h3 className="text-center text-3xl font-bold text-gray-800 dark:text-white">{t("SignInPage.title")}</h3>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-300">
            {t("SignInPage.welcomeText")} <br />
          </p>
        </div>
        <form onSubmit={handleSubmit} className=" mt-8 flex w-full max-w-lg flex-col">
          <div className="mb-4 flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-900 dark:text-white">
              {t("SignInPage.emailLabel")}
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="cem@coinim.com"
              className="mt-2 rounded-lg border border-gray-300 px-4 py-2 placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <label htmlFor="password" className="mt-4 text-sm text-gray-900 dark:text-white">
              {t("SignInPage.passwordLabel")}
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="********"
              className="relative mt-2 rounded-lg border border-gray-300 px-4 py-2 placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <div className="mt-4 flex flex-col items-center justify-between">
              <button
                type="submit"
                className="mt-4 h-12 w-full rounded-lg border border-transparent bg-blue-700 py-2 px-4 text-center text-sm font-medium leading-5 text-white transition-colors duration-200 ease-in-out hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-50 active:bg-blue-800"
              >
                {t("SignInPage.signInButton")}{" "}
              </button>
              <p className="mt-4 flex gap-2 text-sm text-gray-900 dark:text-white">
                {t("SignInPage.noAccount")}{" "}
                <Link to={"/SignUp"}>
                  <span className="font-medium text-blue-500 hover:underline">{t("SignInPage.createAccount")}</span>
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
