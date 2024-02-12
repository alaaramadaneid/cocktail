import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
    const { cocktail } = route.params;
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favorites');
                if (storedFavorites) {
                    const favorites = JSON.parse(storedFavorites);
                    const isCocktailFavorite = favorites.some(fav => fav.id === cocktail.idDrink);
                    setIsFavorite(isCocktailFavorite);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error.message);
            }
        };

        checkFavoriteStatus();
    }, [cocktail.idDrink]);

    const toggleFavorite = async () => {
        try {
            let favorites = [];
            const storedFavorites = await AsyncStorage.getItem('favorites');

            if (storedFavorites) {
                favorites = JSON.parse(storedFavorites);
            }

            if (isFavorite) {
                favorites = favorites.filter(fav => fav.id !== cocktail.idDrink);
            } else {
                favorites.push({ id: cocktail.idDrink, name: cocktail.strDrink, image: cocktail.strDrinkThumb });
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error toggling favorite:', error.message);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: cocktail.strDrinkThumb }} style={styles.image} />
            <Text style={styles.cocktailName}>{cocktail.strDrink}</Text>

            <View style={styles.descriptionContainer}>
                <Text style={styles.description}>{cocktail.strInstructions}</Text>
            </View>

            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                <Text style={styles.favoriteButtonText}>
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    cocktailName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
    },
    description: {
        fontSize: 16,
        textAlign: 'justify',
    },
    favoriteButton: {
        backgroundColor: '#3498db',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    favoriteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default DetailsScreen;
