"use client";
import { RegistrationPage } from "@/components/registration-page";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/WalletProvider";
import { useEffect, useState } from "react";
import HTTP from "@/lib/http";
import { toast } from "sonner";
import { useStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { isConnected, getConnector } = useWallet();
  const { setProfile, authenticatedAccountId } = useStore();
  const wallet = getConnector();
  const [processing, setProcessing] = useState(false);

  const handleRegister = async (formData: any) => {
    setProcessing(true);
    const { data, err } = await HTTP.post(
      "/api/users/prepare-profile-creation",
      formData
    );
    if (!err) {
      try {
        //sign and execute the transaction
        const transaction = await wallet.signAndExecuteTransaction({
          signerAccountId: authenticatedAccountId!,
          transactionList: data.encodedTransaction
        });

        //Followup request
        const response = await HTTP.post("/api/users/record-profile-creation", {
          profileData: data.profileData
        });
        if (!response.err) {
          //Optional i am using this route to get more data becuase this route has things like statistics
          const userData = await HTTP.get(
            `/api/freelancers/${authenticatedAccountId}`
          );
          if (!userData.err) {
            setProfile(userData.data);
            toast.success("Profile created successfully");
            router.push("/dashboard");
          } else {
            toast.error(userData.err);
          }
        } else {
          toast.error(response.err);
        }
      } catch (error) {
        toast.error("Unable to complete operation");
      } finally {
        setProcessing(false);
      }
    } else {
      toast.error(err);
    }
    setProcessing(false);
  };

  useEffect(() => {
    if (!authenticatedAccountId || !isConnected) {
      router.push("/");
    }
  }, [authenticatedAccountId, isConnected]);

  return (
    <RegistrationPage
      onRegister={handleRegister}
      accountId={authenticatedAccountId!}
      processing={processing}
    />
  );
}
