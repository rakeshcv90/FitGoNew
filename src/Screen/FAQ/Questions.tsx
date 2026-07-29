import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import React, {useMemo, useState, useRef, useEffect} from 'react';
import AnimatedReanimated, {
  FadeInDown,
  FadeInUp,
  Layout,
} from 'react-native-reanimated';
import {QuestionsArray, QuestionsArrayType} from './QuestionsArray';
import {AppColor, Fonts, PLATFORM_IOS} from '../../Component/Color';
import FitIcon from '../../Component/Utilities/FitIcon';
import {AnalyticsConsole} from '../../Component/AnalyticsConsole';
import Wrapper from '../WorkoutCompleteScreen/Wrapper';
import LinearGradient from 'react-native-linear-gradient';
import {ArrowLeft} from '../../Component/Utilities/Arrows/Arrow';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Questions = ({route, navigation}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const categories = ['All', 'Challenges', 'Workouts', 'Diet', 'Account'];

  // Hero pulsing ring animation
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const toggleExpand = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQuestions = useMemo(() => {
    return QuestionsArray.filter((item: QuestionsArrayType) => {
      const matchesSearch = item.question
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (selectedCategory === 'All') return matchesSearch;
      if (selectedCategory === 'Challenges')
        return (
          matchesSearch && item.question.toLowerCase().includes('challenge')
        );
      if (selectedCategory === 'Workouts')
        return (
          matchesSearch &&
          (item.question.toLowerCase().includes('workout') ||
            item.question.toLowerCase().includes('exercise'))
        );
      if (selectedCategory === 'Diet')
        return (
          matchesSearch &&
          (item.question.toLowerCase().includes('meal') ||
            item.question.toLowerCase().includes('diet') ||
            item.question.toLowerCase().includes('recipe'))
        );
      return matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const RenderQuestionCard = ({
    item,
    index,
  }: {
    item: QuestionsArrayType;
    index: number;
  }) => {
    const isExpanded = expandedId === item.id;

    return (
      <AnimatedReanimated.View
        entering={FadeInDown.delay(Math.min(index * 50, 400))
          .duration(350)
          .springify()}
        layout={Layout.springify()}>
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => {
            AnalyticsConsole(`Q_${item?.id}`);
            toggleExpand(item.id);
          }}
          style={[
            styles.questionCard,
            isExpanded && styles.questionCardExpanded,
          ]}>
          {/* Accent Indicator Bar */}
          <View
            style={[
              styles.cardAccentBar,
              isExpanded && styles.cardAccentBarExpanded,
            ]}
          />

          <View style={styles.cardHeaderRow}>
            <View style={styles.cardIconBox}>
              <FitIcon
                name={isExpanded ? 'chat-question' : 'chat-question-outline'}
                type="MaterialCommunityIcons"
                size={22}
                color="#667EEA"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.questionTitle}>{item.question}</Text>
            </View>

            <View style={styles.chevronCircle}>
              <FitIcon
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                type="Ionicons"
                size={18}
                color={isExpanded ? '#667EEA' : '#94A3B8'}
              />
            </View>
          </View>

          {/* Accordion Answer Content */}
          {isExpanded && (
            <View style={styles.answerContainer}>
              <Text style={styles.answerText}>{item.answer}</Text>

              <TouchableOpacity
                activeOpacity={0.88}
                onPress={() => {
                  navigation.navigate('ChatBot', {
                    quesNo: item.id,
                    screenName: route.params?.screenName,
                  });
                }}
                style={styles.chatBotActionBtnWrapper}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.chatBotActionBtn}>
                  <FitIcon
                    name="chatbubble-ellipses"
                    type="Ionicons"
                    size={15}
                    color="#FFFFFF"
                  />
                  <Text style={styles.chatBotActionBtnText}>
                    Ask AI Trainer for full detail
                  </Text>
                  <FitIcon
                    name="arrow-forward"
                    type="Ionicons"
                    size={14}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </AnimatedReanimated.View>
    );
  };

  return (
    <Wrapper styles={{backgroundColor: '#F8FAFC'}}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* Top Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={() => navigation.goBack()}>
          <ArrowLeft width={20} height={10} fillColor="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Help Center</Text>

        <TouchableOpacity
          style={styles.aiChatBtn}
          onPress={() => {
            navigation.navigate('p', {
              quesNo: 1,
              screenName: route.params?.screenName,
            });
          }}>
          <FitIcon
            name="chatbubble-ellipses"
            type="Ionicons"
            size={15}
            color="#667EEA"
          />
          <Text style={styles.aiChatBtnText}>Ask AI</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredQuestions}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* Hero Section with Pulsing Aura */}
            <View style={styles.heroSection}>
              <Animated.View style={{transform: [{scale: pulseAnim}]}}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.heroIconCircle}>
                  <FitIcon
                    name="chat-question"
                    type="MaterialCommunityIcons"
                    size={28}
                    color="#FFFFFF"
                  />
                </LinearGradient>
              </Animated.View>
              <Text style={styles.heroTitle}>Frequently Asked Questions</Text>
              <Text style={styles.heroSubtitle}>
                Instant answers to common questions about workouts & challenges
              </Text>

              {/* Search Input Bar */}
              <View style={styles.searchBarWrapper}>
                <FitIcon
                  name="search-outline"
                  type="Ionicons"
                  size={20}
                  color="#667EEA"
                />
                <TextInput
                  placeholder="Search questions or topics..."
                  placeholderTextColor="#94A3B8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <FitIcon
                      name="close-circle"
                      type="Ionicons"
                      size={18}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Pill Tabs */}
            <View style={styles.categoryRow}>
              {categories.map((cat, idx) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.85}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setSelectedCategory(cat);
                    }}
                    style={styles.categoryChipWrapper}>
                    {isSelected ? (
                      <LinearGradient
                        colors={['#667EEA', '#764BA2']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={styles.categoryChipSelected}>
                        <Text style={styles.categoryChipTextSelected}>
                          {cat}
                        </Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.categoryChipInactive}>
                        <Text style={styles.categoryChipTextInactive}>
                          {cat}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        }
        renderItem={({item, index}) => (
          <RenderQuestionCard item={item} index={index} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <FitIcon
              name="search-disallowed"
              type="MaterialCommunityIcons"
              size={46}
              color="#CBD5E1"
            />
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateSub}>
              We couldn't find any questions matching "{searchQuery}"
            </Text>
          </View>
        }
      />
    </Wrapper>
  );
};

export default Questions;

const styles = StyleSheet.create({
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 6,
  },
  backCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 16.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
  },
  aiChatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  aiChatBtnText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#667EEA',
    fontWeight: '700',
  },

  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  heroSection: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  heroTitle: {
    fontSize: 19.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    marginBottom: 14,
    paddingHorizontal: 10,
  },

  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 3,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    width: '100%',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#0F172A',
    marginLeft: 10,
    paddingVertical: 4,
  },

  categoryRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 7,
    flexWrap: 'wrap',
  },
  categoryChipWrapper: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  categoryChipSelected: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  categoryChipInactive: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipTextSelected: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  categoryChipTextInactive: {
    fontSize: 11.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    fontWeight: '600',
  },

  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  questionCardExpanded: {
    borderColor: '#667EEA',
    shadowColor: '#667EEA',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.14,
    shadowRadius: 16,
    elevation: 6,
  },
  cardAccentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: 'transparent',
  },
  cardAccentBarExpanded: {
    backgroundColor: '#667EEA',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingLeft: 16,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  questionTitle: {
    fontSize: 13.5,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },

  answerContainer: {
    borderTopWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  answerText: {
    fontSize: 12.5,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#334155',
    lineHeight: 19,
    marginBottom: 12,
  },
  chatBotActionBtnWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  chatBotActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
    borderRadius: 12,
  },
  chatBotActionBtnText: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontFamily: Fonts.MONTSERRAT_BOLD,
    color: '#0F172A',
    marginTop: 12,
  },
  emptyStateSub: {
    fontSize: 12,
    fontFamily: Fonts.MONTSERRAT_MEDIUM,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
});
