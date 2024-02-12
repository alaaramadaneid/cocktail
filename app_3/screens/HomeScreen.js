import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
    const [cocktails, setCocktails] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchCocktails = async () => {
            try {
                const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`);
                const { drinks } = response.data;

                if (drinks) {
                    setCocktails(drinks);
                } else {
                    console.error('No drinks found in the response');
                }
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchCocktails();
    }, [searchQuery]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('Details', { cocktail: item })}>
            <View style={styles.card}>
                <Image source={{ uri: item.strDrinkThumb }} style={styles.image} />
                <Text style={styles.cocktailName}>{item.strDrink}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search cocktails..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                />
            </View>

            <FlatList
                data={cocktails}
                renderItem={renderItem}
                keyExtractor={item => item.idDrink}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
            />

            <TouchableOpacity
                onPress={() => navigation.navigate('Favorites')}
                style={styles.favoritesButton}
            >
                <Text style={styles.favoritesButtonText}>Go to Favorites</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
    },
    listContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    cocktailName: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    favoritesButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    favoritesButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
