import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  TextInput,
  FlatList,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { createLesson } from "../services/airtableService";
import Icon from "react-native-vector-icons/MaterialIcons";
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';


const AddLesson = ({ navigation, route }) => {
  const { studentId, StudentClass } = route.params;


  // Existing state variables
  const [date, setDate] = useState(new Date());
  const [lessonDescription, setLessonDescription] = useState("");
  const [selectedLessonType, setSelectedLessonType] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // New state variables for Quran class
  const [nextSurah, setNextSurah] = useState("");
  const [fromAyah, setFromAyah] = useState("");
  const [toAyah, setToAyah] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [isDueDatePickerVisible, setDueDatePickerVisibility] = useState(false);

  // State for Surah Modal
  const [isSurahModalVisible, setSurahModalVisible] = useState(false);

  const lessonOptions = [
    { label: "Passed Full", value: "Passed Full" },
    { label: "Passed Half", value: "Passed Half" },
    { label: "Passed None", value: "Passed None" },
    { label: "Other", value: "Other" },
  ];

  // List of Surahs with Arabic and English names
  const surahsData = [
    { number: 1, arabic: "الفاتحة", english: "Al-Fatihah" },
    { number: 2, arabic: "البقرة", english: "Al-Baqarah" },
    { number: 3, arabic: "آل عمران", english: "Al-Imran" },
    { number: 4, arabic: "النساء", english: "An-Nisa" },
    { number: 5, arabic: "المائدة", english: "Al-Ma'idah" },
    { number: 6, arabic: "الأنعام", english: "Al-An'am" },
    { number: 7, arabic: "الأعراف", english: "Al-A'raf" },
    { number: 8, arabic: "الأنفال", english: "Al-Anfal" },
    { number: 9, arabic: "التوبة", english: "At-Tawbah" },
    { number: 10, arabic: "يونس", english: "Yunus" },
    { number: 11, arabic: "هود", english: "Hud" },
    { number: 12, arabic: "يوسف", english: "Yusuf" },
    { number: 13, arabic: "الرعد", english: "Ar-Ra'd" },
    { number: 14, arabic: "إبراهيم", english: "Ibrahim" },
    { number: 15, arabic: "الحجر", english: "Al-Hijr" },
    { number: 16, arabic: "النحل", english: "An-Nahl" },
    { number: 17, arabic: "الإسراء", english: "Al-Isra" },
    { number: 18, arabic: "الكهف", english: "Al-Kahf" },
    { number: 19, arabic: "مريم", english: "Maryam" },
    { number: 20, arabic: "طه", english: "Ta-Ha" },
    { number: 21, arabic: "الأنبياء", english: "Al-Anbiya" },
    { number: 22, arabic: "الحج", english: "Al-Hajj" },
    { number: 23, arabic: "المؤمنون", english: "Al-Mu'minun" },
    { number: 24, arabic: "النور", english: "An-Nur" },
    { number: 25, arabic: "الفرقان", english: "Al-Furqan" },
    { number: 26, arabic: "الشعراء", english: "Ash-Shu'ara" },
    { number: 27, arabic: "النمل", english: "An-Naml" },
    { number: 28, arabic: "القصص", english: "Al-Qasas" },
    { number: 29, arabic: "العنكبوت", english: "Al-Ankabut" },
    { number: 30, arabic: "الروم", english: "Ar-Rum" },
    { number: 31, arabic: "لقمان", english: "Luqman" },
    { number: 32, arabic: "السجدة", english: "As-Sajdah" },
    { number: 33, arabic: "الأحزاب", english: "Al-Ahzab" },
    { number: 34, arabic: "سبأ", english: "Saba'" },
    { number: 35, arabic: "فاطر", english: "Fatir" },
    { number: 36, arabic: "يس", english: "Ya-Sin" },
    { number: 37, arabic: "الصافات", english: "As-Saffat" },
    { number: 38, arabic: "ص", english: "Sad" },
    { number: 39, arabic: "الزمر", english: "Az-Zumar" },
    { number: 40, arabic: "غافر", english: "Ghafir" },
    { number: 41, arabic: "فصلت", english: "Fussilat" },
    { number: 42, arabic: "الشورى", english: "Ash-Shura" },
    { number: 43, arabic: "الزخرف", english: "Az-Zukhruf" },
    { number: 44, arabic: "الدخان", english: "Ad-Dukhan" },
    { number: 45, arabic: "الجاثية", english: "Al-Jathiyah" },
    { number: 46, arabic: "الأحقاف", english: "Al-Ahqaf" },
    { number: 47, arabic: "محمد", english: "Muhammad" },
    { number: 48, arabic: "الفتح", english: "Al-Fath" },
    { number: 49, arabic: "الحجرات", english: "Al-Hujurat" },
    { number: 50, arabic: "ق", english: "Qaf" },
    { number: 51, arabic: "الذاريات", english: "Adh-Dhariyat" },
    { number: 52, arabic: "الطور", english: "At-Tur" },
    { number: 53, arabic: "النجم", english: "An-Najm" },
    { number: 54, arabic: "القمر", english: "Al-Qamar" },
    { number: 55, arabic: "الرحمن", english: "Ar-Rahman" },
    { number: 56, arabic: "الواقعة", english: "Al-Waqi'ah" },
    { number: 57, arabic: "الحديد", english: "Al-Hadid" },
    { number: 58, arabic: "المجادلة", english: "Al-Mujadilah" },
    { number: 59, arabic: "الحشر", english: "Al-Hashr" },
    { number: 60, arabic: "الممتحنة", english: "Al-Mumtahanah" },
    { number: 61, arabic: "الصف", english: "As-Saff" },
    { number: 62, arabic: "الجمعة", english: "Al-Jumu'ah" },
    { number: 63, arabic: "المنافقون", english: "Al-Munafiqun" },
    { number: 64, arabic: "التغابن", english: "At-Taghabun" },
    { number: 65, arabic: "الطلاق", english: "At-Talaq" },
    { number: 66, arabic: "التحريم", english: "At-Tahrim" },
    { number: 67, arabic: "الملك", english: "Al-Mulk" },
    { number: 68, arabic: "القلم", english: "Al-Qalam" },
    { number: 69, arabic: "الحاقة", english: "Al-Haqqah" },
    { number: 70, arabic: "المعارج", english: "Al-Ma'arij" },
    { number: 71, arabic: "نوح", english: "Nuh" },
    { number: 72, arabic: "الجن", english: "Al-Jinn" },
    { number: 73, arabic: "المزمل", english: "Al-Muzzammil" },
    { number: 74, arabic: "المدثر", english: "Al-Muddaththir" },
    { number: 75, arabic: "القيامة", english: "Al-Qiyamah" },
    { number: 76, arabic: "الإنسان", english: "Al-Insan" },
    { number: 77, arabic: "المرسلات", english: "Al-Mursalat" },
    { number: 78, arabic: "النبأ", english: "An-Naba'" },
    { number: 79, arabic: "النازعات", english: "An-Nazi'at" },
    { number: 80, arabic: "عبس", english: "'Abasa" },
    { number: 81, arabic: "التكوير", english: "At-Takwir" },
    { number: 82, arabic: "الإنفطار", english: "Al-Infitar" },
    { number: 83, arabic: "المطففين", english: "Al-Mutaffifin" },
    { number: 84, arabic: "الإنشقاق", english: "Al-Inshiqaq" },
    { number: 85, arabic: "البروج", english: "Al-Buruj" },
    { number: 86, arabic: "الطارق", english: "At-Tariq" },
    { number: 87, arabic: "الأعلى", english: "Al-A'la" },
    { number: 88, arabic: "الغاشية", english: "Al-Ghashiyah" },
    { number: 89, arabic: "الفجر", english: "Al-Fajr" },
    { number: 90, arabic: "البلد", english: "Al-Balad" },
    { number: 91, arabic: "الشمس", english: "Ash-Shams" },
    { number: 92, arabic: "الليل", english: "Al-Layl" },
    { number: 93, arabic: "الضحى", english: "Ad-Duha" },
    { number: 94, arabic: "الشرح", english: "Ash-Sharh" },
    { number: 95, arabic: "التين", english: "At-Tin" },
    { number: 96, arabic: "العلق", english: "Al-'Alaq" },
    { number: 97, arabic: "القدر", english: "Al-Qadr" },
    { number: 98, arabic: "البينة", english: "Al-Bayyinah" },
    { number: 99, arabic: "الزلزلة", english: "Az-Zalzalah" },
    { number: 100, arabic: "العاديات", english: "Al-'Adiyat" },
    { number: 101, arabic: "القارعة", english: "Al-Qari'ah" },
    { number: 102, arabic: "التكاثر", english: "At-Takathur" },
    { number: 103, arabic: "العصر", english: "Al-'Asr" },
    { number: 104, arabic: "الهمزة", english: "Al-Humazah" },
    { number: 105, arabic: "الفيل", english: "Al-Fil" },
    { number: 106, arabic: "قريش", english: "Quraysh" },
    { number: 107, arabic: "الماعون", english: "Al-Ma'un" },
    { number: 108, arabic: "الكوثر", english: "Al-Kawthar" },
    { number: 109, arabic: "الكافرون", english: "Al-Kafirun" },
    { number: 110, arabic: "النصر", english: "An-Nasr" },
    { number: 111, arabic: "المسد", english: "Al-Masad" },
    { number: 112, arabic: "الإخلاص", english: "Al-Ikhlas" },
    { number: 113, arabic: "الفلق", english: "Al-Falaq" },
    { number: 114, arabic: "الناس", english: "An-Nas" },
  ];

  // Reorder surahs to start with Al-Fatihah, Al-Nas, Al-Falaq, and Al-Ikhlas
  const surahsOrdered = [];
  surahsOrdered.push(surahsData.find((s) => s.number === 1)); // Al-Fatihah
  surahsOrdered.push(surahsData.find((s) => s.number === 114)); // An-Nas
  surahsOrdered.push(surahsData.find((s) => s.number === 113)); // Al-Falaq
  surahsOrdered.push(surahsData.find((s) => s.number === 112)); // Al-Ikhlas

  // Add surahs from 111 down to 2
  for (let i = 111; i >= 2; i--) {
    const surah = surahsData.find((s) => s.number === i);
    if (surah) {
      surahsOrdered.push(surah);
    }
  }


  // Date Picker functions
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // New Date Picker functions for due date
  const showDueDatePicker = () => {
    setDueDatePickerVisibility(true);
  };

  const hideDueDatePicker = () => {
    setDueDatePickerVisibility(false);
  };

  const handleDueDateConfirm = (selectedDate) => {
    setDueDate(selectedDate);
    hideDueDatePicker();
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    let finalLessonDescription =
      selectedLessonType === 'Other' ? lessonDescription : selectedLessonType;

    if (!finalLessonDescription || !finalLessonDescription.trim()) {
      setError('Please select a lesson type or enter a description.');
      return;
    }

    // Error checking for Quran class
    if (StudentClass && StudentClass.includes('Quran')) {
      if (!nextSurah.trim() || !fromAyah.trim() || !toAyah.trim()) {
        setError('Please enter the next Surah and Ayah range due.');
        return;
      }
      if (isNaN(fromAyah) || isNaN(toAyah)) {
        setError('Ayahs must be numerical values.');
        return;
      }
      if (parseInt(fromAyah) > parseInt(toAyah)) {
        setError('"From Ayah" cannot be greater than "To Ayah".');
        return;
      }
    }

    const formattedDate = formatDate(date);

    const lessonData = {
      Students: [studentId],
      Date: formattedDate,
      Passed: finalLessonDescription,
    };

    // Include Quran-specific data if applicable
    if (StudentClass && StudentClass.includes('Quran')) {
      lessonData.NextSurahDue = nextSurah;
      lessonData.FromAyah = parseInt(fromAyah);
      lessonData.ToAyah = parseInt(toAyah);
      lessonData.DueDate = formatDate(dueDate);
    }

    try {
      await createLesson(lessonData);
      setShowConfirmationModal(true);
    } catch (error) {
      console.error('Failed to create lesson:', error);
      setError('Failed to submit lesson. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Lesson</Text>

      {/* Lessons Passed Header */}
      <Text style={styles.headerText}>Lessons Passed</Text>

      {/* Date Picker Button */}
      <TouchableOpacity style={styles.datePickerButton} onPress={showDatePicker}>
        <Icon name="calendar-today" size={20} color="#fff" />
        <Text style={styles.datePickerText}>Pick Date</Text>
      </TouchableOpacity>

      <Text style={styles.dateDisplay}>Date: {formatDate(date)}</Text>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        display={Platform.OS === 'ios' ? 'inline' : 'default'}
        themeVariant="light"
        textColor="#fff"
      />

      {/* Custom Dropdown for Lesson Type */}
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownVisible(true)}
      >
        <Text
          style={
            selectedLessonType
              ? styles.dropdownButtonText
              : styles.dropdownPlaceholderText
          }
        >
          {selectedLessonType || 'Select a lesson type...'}
        </Text>
        <Icon name="arrow-drop-down" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setDropdownVisible(false)}
        />
        <View style={styles.dropdownModal}>
          <FlatList
            data={lessonOptions}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedLessonType(item.value);
                  setError('');
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Show description input if 'Other' is selected */}
      {selectedLessonType === 'Other' && (
        <TextInput
          placeholder="Enter lesson description"
          placeholderTextColor="#ccc"
          value={lessonDescription}
          onChangeText={(text) => {
            setLessonDescription(text);
            setError('');
          }}
          style={styles.input}
        />
      )}

      {/* Conditionally render Quran-specific fields */}
      {StudentClass && StudentClass.includes('Quran') && (
        <>
          {/* Next Lesson Due Header */}
          <Text style={styles.headerText}>Next Lesson Due</Text>

          {/* Surah selection button */}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setSurahModalVisible(true)}
          >
            <Text
              style={
                nextSurah
                  ? styles.dropdownButtonText
                  : styles.dropdownPlaceholderText
              }
            >
              {nextSurah || 'Select Next Surah Due...'}
            </Text>
            <Icon name="arrow-drop-down" size={24} color="#FFF" />
          </TouchableOpacity>

          {/* Surah selection modal */}
          <Modal
            visible={isSurahModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setSurahModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              onPress={() => setSurahModalVisible(false)}
            />
            <View style={styles.dropdownModal}>
              <FlatList
                data={surahsOrdered}
                keyExtractor={(item) => item.number.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNextSurah(`${item.arabic} - ${item.english}`);
                      setError('');
                      setSurahModalVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>
                      {item.arabic} - {item.english}
                    </Text>
                  </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 1, backgroundColor: '#FFF' }} />
                )}
              />
            </View>
          </Modal>

          {/* From Ayah input */}
          <TextInput
            placeholder="From Ayah"
            placeholderTextColor="#ccc"
            value={fromAyah}
            onChangeText={(text) => {
              setFromAyah(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            style={styles.input}
            keyboardType="numeric"
            returnKeyType='done'
          />

          {/* To Ayah input */}
          <TextInput
            placeholder="To Ayah"
            placeholderTextColor="#ccc"
            value={toAyah}
            onChangeText={(text) => {
              setToAyah(text.replace(/[^0-9]/g, ''));
              setError('');
            }}
            style={styles.input}
            keyboardType="numeric"
            returnKeyType='done'
          />

          {/* Due date picker button */}
          <TouchableOpacity style={styles.datePickerButton} onPress={showDueDatePicker}>
            <Icon name="calendar-today" size={20} color="#fff" />
            <Text style={styles.datePickerText}>Pick Due Date</Text>
          </TouchableOpacity>
          <Text style={styles.dateDisplay}>Due Date: {formatDate(dueDate)}</Text>
          {/* Date Picker Modal for due date */}
          <DateTimePickerModal
            isVisible={isDueDatePickerVisible}
            mode="date"
            onConfirm={handleDueDateConfirm}
            onCancel={hideDueDatePicker}
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            themeVariant="light"
            textColor="#fff"
          />
        </>
      )}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Lesson</Text>
      </TouchableOpacity>

      {/* Success Modal */}
      {showConfirmationModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showConfirmationModal}
          onRequestClose={() => {
            setShowConfirmationModal(false);
            navigation.goBack();
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Lesson added successfully!</Text>
              <TouchableOpacity
                style={styles.buttonClose}
                onPress={() => {
                  setShowConfirmationModal(false);
                  navigation.goBack();
                }}
              >
                <Text style={styles.textStyle}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Existing styles remain the same
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252C30',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    marginTop: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#FFF',
    borderRadius: 5,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B73E8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#FFF',
    marginLeft: 10,
  },
  dateDisplay: {
    fontSize: 18,
    color: '#FFF',
    paddingVertical: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1B73E8',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: '#333840',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#1B73E8',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FFF',
  },
  // New styles for the custom dropdown
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#333840',
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
  },
  dropdownButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  dropdownPlaceholderText: {
    color: '#aaa',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownModal: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    bottom: '20%',
    backgroundColor: '#333840',
    borderRadius: 5,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddLesson;
