import { Button, Center, Spinner, Text, useToast } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Play } from "../components/Play";
import { doAddAnswer, fetchFlags, fetchUser } from "../fetches";
import { Answer } from "../types";

// types

export function FlagsPage() {
	let navigate = useNavigate();
	const toast = useToast();
	const { i18n, t } = useTranslation();
	const lang = i18n.language as "en" | "ku";

	// fetch

	// fetch flags data
	const {
		isLoading: flagsAreLoading,
		data: flagsData,
		error: flagsError,
	} = useQuery({
		queryKey: ["getFlags"],
		queryFn: () => fetchFlags(),
	});

	const {
		isLoading: userIsLoading,
		error: userError,
		data: userData,
		refetch: userRefetch,
	} = useQuery({
		queryKey: ["getUser"],
		queryFn: () => fetchUser(),
		retry: false,
	});

	// add result to users answers
	const mutation = useMutation({
		mutationFn: (answer: Answer) => doAddAnswer(answer),
		onSuccess: () => userRefetch(),
		onError: () =>
			toast({
				title: t("Failed to push answers"),
				status: "error",
				duration: 3000,
				variant: "solid",
			}),
	});

	// handle

	const handleAnswer = (selected: number) => {
		if (!flagsData || !userData) return;

		// always compare answers in english
		let userAnswerEn = flagsData["en"][userData.flags.index].variants[selected];
		let correctAnswerEn = flagsData["en"][userData.flags.index].answer;
		let isCorrect = userAnswerEn === correctAnswerEn;

		let userAnswer = flagsData[lang][userData.flags.index].variants[selected];
		let correctAnswer = flagsData[lang][userData.flags.index].answer;

		// show toast
		toast({
			title: t(`Answer was ${isCorrect ? "correct" : "incorrect"}`),
			status: isCorrect ? "success" : "error",
			duration: 3000,
			variant: "solid",
		});

		// send data to server
		mutation.mutate({
			flag: flagsData[lang][userData.flags.index].flag,
			correctAnswer,
			userAnswer,
			isCorrect,
		});
	};

	// render

	if (flagsAreLoading || userIsLoading) {
		return <Spinner size={"xl"} m={4}></Spinner>;
	}

	if (mutation.isLoading) {
		return (
			<Center flexDirection={"column"}>
				<Text>{t("Saving answer...")}</Text>
				<Spinner size={"xl"} m={4}></Spinner>
			</Center>
		);
	}

	if (userError || !userData) {
		return (
			<Center flexDirection={"column"} gap={"4"}>
				<Text>{t("You're not logged in")}</Text>
				<Link to={"/"}>
					<Button>{t("Go back")}</Button>
				</Link>
			</Center>
		);
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
