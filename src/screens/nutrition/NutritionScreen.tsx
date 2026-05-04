import React, { useState } from 'react';
import { View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Modal } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SectionCard } from '../../components/ui/SectionCard';
import { openFoodService, OpenFoodItem } from '../../services/openFood';
import { Search, Flame, Beef, Wheat, Droplets, X, Plus } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { customAlert } from '../../utils/alert';


// ─── Search Result Item ────────────────────────────────────────────
const SearchResultItem = ({
  item,
  onAdd,
  theme,
}: {
  item: OpenFoodItem;
  onAdd: (item: OpenFoodItem) => void;
  theme: any;
}) => (
  <TouchableOpacity
    onPress={() => onAdd(item)}
    style={[styles.resultItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
    activeOpacity={0.7}
  >
    <View style={styles.resultLeft}>
      <Text style={[styles.resultName, { color: theme.colors.onBackground }]} numberOfLines={1}>
        {item.food_name}
      </Text>
      {item.brand ? (
        <Text style={[styles.resultBrand, { color: theme.colors.grey500 }]} numberOfLines={1}>
          {item.brand}
        </Text>
      ) : null}
      <Text style={[styles.resultMacros, { color: theme.colors.onSurface }]}>
        P: {item.nf_protein}g · C: {item.nf_total_carbohydrate}g · F: {item.nf_total_fat}g
        {'  '}per {item.serving_qty}{item.serving_unit}
      </Text>
    </View>
    <View style={styles.resultRight}>
      <Text style={[styles.resultCal, { color: theme.colors.primary }]}>
        {item.nf_calories}
      </Text>
      <Text style={[styles.resultCalLabel, { color: theme.colors.grey500 }]}>kcal</Text>
      <View style={[styles.addBtn, { backgroundColor: theme.colors.primary }]}>
        <Plus color="#fff" size={16} />
      </View>
    </View>
  </TouchableOpacity>
);

// ─── Macro Pill ────────────────────────────────────────────────────
const MacroPill = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) => (
  <View style={[styles.macroPill, { backgroundColor: color + '15' }]}>
    {icon}
    <Text style={[styles.macroValue, { color }]}>{value}</Text>
    <Text style={[styles.macroLabel, { color }]}>{label}</Text>
  </View>
);

// ─── Main Screen ───────────────────────────────────────────────────
export const NutritionScreen: React.FC = () => {
  const { theme } = useTheme();

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<OpenFoodItem[]>([]);
  const [loggedFoods, setLoggedFoods] = useState<OpenFoodItem[]>([]);
  const [showResults, setShowResults] = useState(false);

  // ── Search ─────────────────────────────────────────────────────
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setShowResults(true);
    try {
      const result = await openFoodService.searchFood(query);
      setSearchResults(result.foods);
      if (result.foods.length === 0) {
        customAlert('No Results', `Nothing found for "${query}". Try a simpler term.`);
        setShowResults(false);
      }
    } catch (error) {
      customAlert('Network Error', 'Could not reach the food database. Check your internet connection.');
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = (item: OpenFoodItem) => {
    setLoggedFoods(prev => [item, ...prev]);
    setShowResults(false);
    setSearchResults([]);
    setQuery('');
  };

  const handleRemove = (index: number) => {
    setLoggedFoods(prev => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    customAlert('Clear Log', 'Remove all logged foods?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => setLoggedFoods([]) },
    ]);
  };

  // ── Totals ──────────────────────────────────────────────────────
  const totals = loggedFoods.reduce(
    (acc, f) => ({
      calories: acc.calories + f.nf_calories,
      protein: acc.protein + f.nf_protein,
      carbs: acc.carbs + f.nf_total_carbohydrate,
      fat: acc.fat + f.nf_total_fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  // ── Render ──────────────────────────────────────────────────────
  return (
    <LinearGradient colors={theme.colors.gradients.background} style={styles.container}>
      <FlatList
        data={loggedFoods}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        ListHeaderComponent={
          <>
            {/* Search Header */}
            <SectionCard style={styles.headerCard}>
              <Text style={[styles.title, { color: theme.colors.onBackground }]}>
                Nutrition Tracker
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
                Search any food to log its macros
              </Text>

              <View style={[styles.searchBar, { backgroundColor: theme.colors.background, borderColor: theme.colors.outline }]}>
                <TextInput
                  style={[styles.searchInput, { color: theme.colors.onBackground }]}
                  placeholder="Search food (e.g. apple, chicken, pizza…)"
                  placeholderTextColor={theme.colors.grey500}
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                {loading
                  ? <ActivityIndicator color={theme.colors.primary} style={styles.searchIcon} />
                  : (
                    <TouchableOpacity onPress={handleSearch} style={[styles.searchIcon, { backgroundColor: theme.colors.primary, borderRadius: 8, padding: 10 }]}>
                      <Search color="#fff" size={18} />
                    </TouchableOpacity>
                  )}
              </View>
            </SectionCard>

            {/* Daily Summary */}
            {loggedFoods.length > 0 && (
              <SectionCard style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                    Today's Summary
                  </Text>
                  <TouchableOpacity onPress={handleClear}>
                    <Text style={{ color: theme.colors.error, fontWeight: '600', fontSize: 13 }}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.macroRow}>
                  <MacroPill icon={<Flame color="#ff6b35" size={20} />} label="kcal" value={String(Math.round(totals.calories))} color="#ff6b35" />
                  <MacroPill icon={<Beef color="#e63946" size={20} />} label="Protein" value={`${Math.round(totals.protein)}g`} color="#e63946" />
                  <MacroPill icon={<Wheat color="#f4a261" size={20} />} label="Carbs" value={`${Math.round(totals.carbs)}g`} color="#f4a261" />
                  <MacroPill icon={<Droplets color="#457b9d" size={20} />} label="Fat" value={`${Math.round(totals.fat)}g`} color="#457b9d" />
                </View>
              </SectionCard>
            )}

            {/* Logged Foods Header */}
            {loggedFoods.length > 0 && (
              <Text style={[styles.sectionTitle, { color: theme.colors.onBackground, marginHorizontal: 4, marginBottom: 8, marginTop: 4 }]}>
                Logged Foods ({loggedFoods.length})
              </Text>
            )}
          </>
        }
        renderItem={({ item, index }) => (
          <View style={[styles.loggedItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
            <View style={styles.loggedLeft}>
              <Text style={[styles.loggedName, { color: theme.colors.onBackground }]} numberOfLines={1}>
                {item.food_name}
              </Text>
              {item.brand ? (
                <Text style={[styles.loggedBrand, { color: theme.colors.grey500 }]}>{item.brand}</Text>
              ) : null}
              <Text style={[styles.loggedMacros, { color: theme.colors.onSurface }]}>
                P: {item.nf_protein}g · C: {item.nf_total_carbohydrate}g · F: {item.nf_total_fat}g
              </Text>
            </View>
            <View style={styles.loggedRight}>
              <Text style={[styles.loggedCal, { color: theme.colors.primary }]}>{item.nf_calories}</Text>
              <Text style={{ color: theme.colors.grey500, fontSize: 11 }}>kcal</Text>
              <TouchableOpacity onPress={() => handleRemove(index)} style={styles.removeBtn}>
                <X color={theme.colors.error} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <SectionCard style={styles.emptyCard}>
            <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>🥗</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.onBackground }]}>
              No foods logged yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.onSurface }]}>
              Search for any food above to track your daily nutrition and macros
            </Text>
          </SectionCard>
        }
      />

      {/* Search Results Modal */}
      <Modal visible={showResults} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.onBackground }]}>
                Results for "{query}"
              </Text>
              <TouchableOpacity onPress={() => setShowResults(false)}>
                <X color={theme.colors.onBackground} size={22} />
              </TouchableOpacity>
            </View>
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(_, i) => String(i)}
                renderItem={({ item }) => (
                  <SearchResultItem item={item} onAdd={handleAddFood} theme={theme} />
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16, paddingBottom: 50 },
  headerCard: { marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { fontSize: 13, marginBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingLeft: 12,
  },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 12 },
  searchIcon: { margin: 6 },
  summaryCard: { marginBottom: 16 },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  macroRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  macroPill: { flex: 1, alignItems: 'center', borderRadius: 12, paddingVertical: 10, gap: 3 },
  macroValue: { fontSize: 16, fontWeight: '800' },
  macroLabel: { fontSize: 11, fontWeight: '600' },
  loggedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  loggedLeft: { flex: 1, marginRight: 12 },
  loggedName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  loggedBrand: { fontSize: 12, marginBottom: 3 },
  loggedMacros: { fontSize: 12 },
  loggedRight: { alignItems: 'flex-end', gap: 2 },
  loggedCal: { fontSize: 20, fontWeight: '800' },
  removeBtn: { marginTop: 4, padding: 2 },
  emptyCard: { alignItems: 'center', paddingVertical: 40, marginTop: 8 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 },
  // Search results modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '80%', paddingTop: 8 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#ccc' },
  modalTitle: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 12 },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  resultLeft: { flex: 1, marginRight: 10 },
  resultName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  resultBrand: { fontSize: 12, marginBottom: 4 },
  resultMacros: { fontSize: 12 },
  resultRight: { alignItems: 'center', gap: 2 },
  resultCal: { fontSize: 20, fontWeight: '800' },
  resultCalLabel: { fontSize: 11 },
  addBtn: { marginTop: 6, borderRadius: 8, padding: 6 },
});
