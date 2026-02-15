
import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';
import { SearchIcon, CloseIcon } from './TabIcons'; // Assuming these exist in same folder
import { COUNTRIES } from '../constants/countries';

const CountryPickerModal = ({ visible, onClose, onSelectCountry }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCountries = COUNTRIES.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.dial_code.includes(searchQuery)
    );

    const renderCountryItem = ({ item }) => (
        <TouchableOpacity
            style={styles.countryItem}
            onPress={() => {
                onSelectCountry(item);
                onClose();
                setSearchQuery('');
            }}
        >
            <Text style={styles.countryFlag}>{item.flag}</Text>
            <Text style={styles.countryName}>{item.name}</Text>
            <Text style={styles.countryDialCode}>{item.dial_code}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.countryModalOverlay}>
                <View style={styles.countryModalContainer}>
                    <View style={styles.countryModalHeader}>
                        <Text style={styles.countryModalTitle}>Select Country</Text>
                        <TouchableOpacity onPress={onClose}>
                            <CloseIcon size={24} color={COLORS.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchContainer}>
                        <SearchIcon size={20} color={COLORS.gray[500]} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search country..."
                            placeholderTextColor={COLORS.gray[500]}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <FlatList
                        data={filteredCountries}
                        keyExtractor={(item) => item.code}
                        renderItem={renderCountryItem}
                        initialNumToRender={15}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    countryModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    countryModalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        padding: 24,
    },
    countryModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    countryModalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.black,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    countryFlag: {
        fontSize: 24,
        marginRight: 12,
    },
    countryName: {
        flex: 1,
        fontSize: 16,
        color: COLORS.black,
    },
    countryDialCode: {
        fontSize: 14,
        color: COLORS.gray[600],
        fontWeight: '600',
    },
});

export default CountryPickerModal;
