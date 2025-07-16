import { Text, TouchableOpacity, Image, Platform, View } from 'react-native';
import { MenuItem } from "@/type";
import { useCartStore } from "@/store/cart.store";

const MenuCard = ({ item }: { item: MenuItem }) => {
    const { $id, image_url, name, price } = item;
    const { addItem } = useCartStore();

    const handleAddToCart = () => {
        addItem({
            id: $id,
            name,
            price,
            image_url,
            customizations: [],
        });
    };

    return (
        <TouchableOpacity
            className="menu-card"
            style={
                Platform.OS === 'android'
                    ? { elevation: 10, shadowColor: '#878787' }
                    : {}
            }
        >
            <Image
                source={{ uri: image_url }}
                style={{ width: 100, height: 100, marginTop: -40, alignSelf: 'center' }}
                resizeMode="contain"
                onError={(e) => {
                    console.log("❌ Image failed to load:", e.nativeEvent.error);
                    console.log("🖼 Image URL used:", image_url);
                }}
            />

            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>
                    {name}
                </Text>
                <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
                <TouchableOpacity onPress={handleAddToCart}>
                    <Text className="paragraph-bold text-primary">Add to Cart +</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default MenuCard;
