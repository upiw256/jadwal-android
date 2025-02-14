import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-paper";
import axios from "axios";

const JadwalScreen = () => {
  const [kelas, setKelas] = useState("");
  interface Kelas {
    id: number;
    nama: string;
  }

  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  interface Jadwal {
    day_of_week: string;
    class_name: string;
    teacher_name: string;
    subject_name: string;
    start_time: string;
    end_time: string;
  }

  const [jadwal, setJadwal] = useState<Jadwal[]>([]);
  const token = "Sman1margaasih*";

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`http://192.168.0.4:8000/api/classroom`, { headers })
      .then((response) => {
        setKelasList(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (kelas) {
      setJadwal([]); // Reset jadwal state
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`http://192.168.0.4:8000/api/schedules/${kelas}`, { headers })
        .then((response) => {
          setJadwal(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setJadwal([]); // Reset jadwal state if no class is selected
    }
  }, [kelas]);

  const groupedJadwal = jadwal.reduce((acc, item) => {
    if (!acc[item.day_of_week]) {
      acc[item.day_of_week] = [];
    }
    acc[item.day_of_week].push(item);
    return acc;
  }, {} as Record<string, Jadwal[]>);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Kelas</Text>
      <Picker
        selectedValue={kelas}
        style={styles.picker}
        onValueChange={(itemValue) => setKelas(itemValue)}
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Pilih Kelas" value="" />
        {kelasList.map((item, index) => (
          <Picker.Item key={index} label={item.nama} value={item.id} />
        ))}
      </Picker>
      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedJadwal).length === 0 ? (
          <Text style={styles.noScheduleText}>Jadwal belum ada</Text>
        ) : (
          Object.keys(groupedJadwal).map((day, index) => (
            <View key={index}>
              <Text style={styles.dayTitle}>{day}</Text>
              {groupedJadwal[day].map((item, idx) => (
                <Card key={idx} style={styles.card}>
                  <Text style={styles.subject}>{item.class_name}</Text>
                  <Text style={styles.subject}>
                    {item.teacher_name} ({item.subject_name})
                  </Text>
                  <Text style={styles.time}>
                    {item.start_time} - {item.end_time}
                  </Text>
                </Card>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#121212", // Background color for dark theme
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#ffffff", // Text color for dark theme
  },
  picker: {
    marginBottom: 10,
    color: "#ffffff", // Text color for dark theme
    backgroundColor: "#1e1e1e", // Picker background color for dark theme
  },
  pickerItem: {
    color: "#ffffff", // Picker item text color for dark theme
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#1e1e1e", // Card background color for dark theme
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#007bff",
    color: "#fff",
    padding: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  subject: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff", // Text color for dark theme
  },
  time: {
    color: "gray",
  },
  noScheduleText: {
    textAlign: "center",
    color: "#ffffff", // Text color for dark theme
    marginTop: 20,
  },
});

export default JadwalScreen;
