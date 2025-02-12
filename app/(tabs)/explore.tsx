import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Card } from "react-native-paper";
import axios, { AxiosError } from "axios";

const JadwalScreen = () => {
  const [guru, setGuru] = useState<string | null>(null);
  const [guruList, setGuruList] = useState<{ id: string; nama: string }[]>([]);
  const [groupedJadwal, setGroupedJadwal] = useState<
    {
      [key: string]: {
        day_of_week: string;
        class_name: string;
        start_time: string;
        end_time: string;
      }[];
    }
  >({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = "Sman1margaasih*";

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .get(`https://blog.test/api/teachers`, { headers })
      .then((response) => {
        setGuruList(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (guru) {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`https://blog.test/api/teacher/${guru}`, { headers })
        .then((response) => {
          const groupedJadwal = response.data.data.reduce(
            (
              acc: {
                [key: string]: {
                  day_of_week: string;
                  class_name: string;
                  start_time: string;
                  end_time: string;
                }[];
              },
              current: {
                day_of_week: string;
                class_name: string;
                start_time: string;
                end_time: string;
              }
            ) => {
              const day = current.day_of_week;
              if (!acc[day]) {
                acc[day] = [];
              }
              acc[day].push(current);
              return acc;
            },
            {} as {
              [key: string]: {
                day_of_week: string;
                class_name: string;
                start_time: string;
                end_time: string;
              }[];
            }
          );
          setGroupedJadwal(groupedJadwal);
          setErrorMessage(null);
        })
        .catch((error: AxiosError) => {
          if (error.response?.status === 404) {
            setErrorMessage("Guru belum memiliki jadwal");
          } else {
            console.error(error);
          }
        });
    } else {
      setGroupedJadwal({});
      setErrorMessage(null);
    }
  }, [guru]);

  const formatTimeTo12Hour = (time: string) => {
    const [hour, minute] = time.split(":");
    const hourNumber = parseInt(hour, 10);
    const period = hourNumber >= 12 ? "PM" : "AM";
    const formattedHour = hourNumber % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  };

  const days = {
    monday: "Senin",
    tuesday: "Selasa",
    wednesday: "Rabu",
    thursday: "Kamis",
    friday: "Jumat",
    saturday: "Sabtu",
    sunday: "Minggu",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Guru</Text>
      <Picker
        selectedValue={guru}
        onValueChange={(itemValue) => setGuru(itemValue as string | null)}
        style={styles.picker}
      >
        <Picker.Item label="Pilih Guru" value={null} />
        {guruList &&
          guruList.map((item, index) => (
            <Picker.Item key={index} label={item.nama} value={item.id} />
          ))}
      </Picker>
      {errorMessage ? (
        <Text style={styles.noData}>{errorMessage}</Text>
      ) : (
        <ScrollView>
          {Object.keys(groupedJadwal).length > 0 &&
            Object.keys(groupedJadwal).map((day, index) => (
              <Card key={index} style={styles.card}>
                <View style={styles.dayTitleContainer}>
                  <Text style={styles.dayTitle}>
                    Hari: {days[day as keyof typeof days]}
                  </Text>
                </View>
                {groupedJadwal[day].map((item, idx) => (
                  <View key={idx} style={styles.jadwalItem}>
                    <Text style={styles.text}>
                      Waktu: {formatTimeTo12Hour(item.start_time)} -{" "}
                      {formatTimeTo12Hour(item.end_time)}
                    </Text>
                    <Text style={styles.text}>
                      Nama Kelas: {item.class_name}
                    </Text>
                  </View>
                ))}
              </Card>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#121212", // Dark theme background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#ffffff", // Dark theme text color
  },
  picker: {
    marginBottom: 10,
    color: "#ffffff", // Dark theme text color for picker
    backgroundColor: "#1e1e1e", // Dark theme background for picker
  },
  card: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#1e1e1e", // Dark theme card background
  },
  dayTitleContainer: {
    backgroundColor: "#007bff", // Blue background for header
    borderRadius: 5,
    padding: 5,
  },
  dayTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff", // Dark theme text color
  },
  jadwalItem: {
    marginBottom: 10,
  },
  text: {
    color: "#ffffff", // Dark theme text color
  },
  noData: {
    textAlign: "center",
    color: "#ffffff", // Dark theme text color
    marginTop: 10,
  },
});

export default JadwalScreen;

