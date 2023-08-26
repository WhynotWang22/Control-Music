import { Image, Text, View } from "react-native"
import styles from "./styles"
import React from "react"

interface INotificationProps {
    time: string
    app: string
    title: string
    titleBig: string
    text: string
    subText: string
    summaryText: string
    bigText: string
    audioContentsURI: string
    imageBackgroundURI: string
    extraInfoText: string
    icon: string
    image: string
    iconLarge: any
}
export const Notification: React.FC<INotificationProps> = ({
    time,
    app,
    title,
    titleBig,
    text,
    subText,
    summaryText,
    bigText,
    audioContentsURI,
    imageBackgroundURI,
    extraInfoText,
    icon,
    image,
    iconLarge,
}) => {
    return (
        <View style={styles.notificationWrapper}>
            <View style={styles.notification}>
                <View style={styles.imagesWrapper}>
                    {!!icon && (
                        <View style={styles.notificationIconWrapper}>
                            <Image
                                source={{ uri: icon }}
                                style={styles.notificationIcon}
                            />
                        </View>
                    )}
                    {!!image && (
                        <View style={styles.notificationImageWrapper}>
                            <Image
                                source={{ uri: image }}
                                style={styles.notificationImage}
                            />
                        </View>
                    )}
                    {!!iconLarge && (
                        <View style={styles.notificationImageWrapper}>
                            <Image
                                source={{ uri: iconLarge }}
                                style={styles.notificationImage}
                            />
                        </View>
                    )}
                </View>
                <View style={styles.notificationInfoWrapper}>
                    <Text style={styles.textInfo}>{`app: ${app}`}</Text>
                    <Text style={styles.textInfo}>{`title: ${title}`}</Text>
                    <Text style={styles.textInfo}>{`text: ${text}`}</Text>
                    {!!time && (
                        <Text style={styles.textInfo}>{`time: ${time}`}</Text>
                    )}
                    {!!titleBig && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`titleBig: ${titleBig}`}</Text>
                    )}
                    {!!subText && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`subText: ${subText}`}</Text>
                    )}
                    {!!summaryText && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`summaryText: ${summaryText}`}</Text>
                    )}
                    {!!bigText && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`bigText: ${bigText}`}</Text>
                    )}
                    {!!audioContentsURI && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`audioContentsURI: ${audioContentsURI}`}</Text>
                    )}
                    {!!imageBackgroundURI && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`imageBackgroundURI: ${imageBackgroundURI}`}</Text>
                    )}
                    {!!extraInfoText && (
                        <Text
                            style={
                                styles.textInfo
                            }>{`extraInfoText: ${extraInfoText}`}</Text>
                    )}
                </View>
            </View>
        </View>
    )
}