import { Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Play } from "../components/Play";
import { Answer, FlagsResponse, UserResponse } from "../types";

// types

export function Flags() {
	const toast = useToast();
	const { i18n, t } = useTranslation();
	const lang = i18n.language as "en" | "ku";

	// fetch

	const {
		isLoading: flagsAreLoading,
		data: flagsData,
		error: flagsError,
	} = useQuery({
		queryKey: ["getFlags"],
		queryFn: async () => {
			const res = await fetch(`https://countries-backend.ahmed.systems/flags`);
			const resData = await res.json();
			console.log(resData);
			return resData as FlagsResponse;
		},
	});

	const {
		isLoading: userIsLoading,
		data: userData,
		error: userError,
		refetch: userRefetch,
	} = useQuery({
		queryKey: ["getUser"],
		queryFn: async () => {
			let res = await axios.get(
				"https://countries-backend.ahmed.systems/users/ahmed",
			);
			return res.data as UserResponse;
		},
	});

	const mutation = useMutation({
		mutationFn: (answer: { answer: Answer }) => {
			return axios.patch(
				"https://countries-backend.ahmed.systems/users/ahmed/flags",
				answer,
			);
		},
		onSuccess: () => userRefetch(),
		onError: () =>
			toast({
				title: "Failed to push answers",
				status: "error",
				duration: 3000,
				variant: "solid",
			}),
	});

	// handle

	const handleAnswer = (selectedVariant: string) => {
		if (!flagsData || !userData) return;

		let isCorrect =
			selectedVariant === flagsData[lang][userData.flags.index].answer;

		toast({
			title: t(`Answer was ${isCorrect ? "correct" : "incorrect"}`),
			status: isCorrect ? "success" : "error",
			duration: 3000,
			variant: "solid",
			containerStyle: {
				fontFamily: "NizarART",
			},
		});

		mutation.mutate({
			answer: {
				flag: flagsData[lang][userData.flags.index].flag,
				correctAnswer: flagsData[lang][userData.flags.index].answer,
				userAnswer: selectedVariant,
				isCorrect:
					flagsData[lang][userData.flags.index].answer === selectedVariant,
			},
		});
	};

	// render

	if (flagsAreLoading || userIsLoading || mutation.isLoading) {
		return <Spinner size={"xl"} m={4}></Spinner>;
	}

	if (flagsError || userError || !flagsData || !userData) {
		return <Text>Couldn't load anything</Text>;
	}

	if (true) {
		return (
			<Play
				flag={flagsData[lang][userData.flags.index].flag}
				variants={flagsData[lang][userData.flags.index].variants}
				handleAnswer={handleAnswer}
				history={userData.flags.answers}
				clearHistory={() => {}}
			/>
		);
	}
}
