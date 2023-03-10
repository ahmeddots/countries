import { createAvatar } from "@dicebear/core";
import { croodlesNeutral } from "@dicebear/collection";
import { Image, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function UserPicture(props: { username: string }) {
	const [valImage, setImage] = useState<string>();

	useEffect(() => {
		const avatar = createAvatar(croodlesNeutral, {
			seed: props.username,
		});

		let uri = avatar.toDataUriSync();

		setImage(uri);
	}, [props.username]);

	return (
		<Image
			bgGradient={useColorModeValue(
				"linear(to-r, blue.300, purple.400)",
				"linear(to-r, blue.100, purple.200)",
			)}
			p="2"
			w={"16"}
			borderRadius={"full"}
			src={valImage}
		/>
	);
}
