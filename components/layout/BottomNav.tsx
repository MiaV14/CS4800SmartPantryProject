// Any relevant imports
import { COLORS } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Href, usePathname, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


// Calling function onAddPress
type BottomNavProps = {
    // When you click the add button in the navbar
    onAddPress: () => void;
};

type TabItem = {
  name: string;
  route: Href | null;
  icon: keyof typeof Ionicons.glyphMap;
};

// The actual function
export default function BottomNav({onAddPress}: BottomNavProps) {
    const router = useRouter();     // for Navigation: router.push('/list');
    const pathname = usePathname(); // current Screen

    // NavBar Sections
    const tabs = [
        // HOME
        { name: 'Home', route: '/', icon: 'home' },
        //RECIPES
        { name: 'Recipes', route: '/recipes', icon: 'restaurant' },
        // ADD ITEM - This will be a pop, not separate screen. No route.
        { name: 'Add', route: null, icon: 'add' },
        // GROCERY LIST
        { name: 'List', route: '/list', icon: 'list' },
        // APP SETTINGS
        { name: 'Settings', route: '/settings', icon: 'settings' },
    ];

    // Did user click regular nav component like home/recipe/wtc OR the modal add? 
    // Lets figure it out boii.
    // What TAB is currently ACTIVE?
    return (
        // Mapping the tabs to what actions they perform
        <View style={styles.container}>
            {tabs.map((tab) => {
                // Checking if the tab we are is/isnt the add button or regular hom/list/recipts/settings tab
                const isAddButton = tab.name === 'Add';
                const isActive = !isAddButton && pathname === tab.route;

                // If ADD button -> open modal
                if (isAddButton) {
                    return (
                        <TouchableOpacity
                        key={tab.name}
                        style={styles.addWrapper}
                        onPress={onAddPress}
                        >
                            <View style={styles.addButton}>
                                <Ionicons name='add' size={30} color="white" />
                            </View>
                        </TouchableOpacity>
                    )
                }

                // Otherwise -> return the normal nav tabs.
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => {
                            if (tab.route) {
                                router.push(tab.route as any);
                            }
                        }}
                    >
                        {isActive && <View style={styles.activeIndicator} />}
                        
                        <Ionicons
                        name={tab.icon as keyof typeof Ionicons.glyphMap}
                        size={24}
                        color={isActive ? COLORS.active : COLORS.inactive}
                        />

                        <Text style={[styles.label, isActive && styles.activeLabel]}>
                            {tab.name}
                        </Text>

                    </TouchableOpacity>
                );

            })}
        </View>
    );
}

// STYLESHEET
const styles = StyleSheet.create({
    // Nav Bar container: [home, recipes, add, list, settings]
    container: {
        flexDirection: 'row',
        backgroundColor: COLORS.porcelain,
        borderTopWidth: 1,
        borderTopColor: COLORS.honeydew_shadow,
        paddingTop: 10,
        paddingBottom: 14,
        alignItems: 'flex-end',
    },

    // Screen
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },

    // Text Labels [home, recipes, list, settings]
    label: {
        fontSize: 12,
        marginTop: 4,
        color: COLORS.inactive,
    },

    // If ACTIVE
    activeLabel: {
        color: COLORS.active,
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        top: -10,
        width: 38,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.active,
    },

    // ADD button
    addWrapper: {
        flex: 1,
        alignItems: 'center',
    },
    addButton: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: COLORS.active,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
});