import {
  Text,
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
// icons
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
// async storage to store the todo list
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Index() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  // Load todos from AsyncStorage when the app is launched
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await AsyncStorage.getItem("todos");
        if (storedTodos) {
          setTodos(JSON.parse(storedTodos)); // Parse and set stored todos
        }
      } catch (error) {
        console.error("Error loading todos from AsyncStorage:", error);
      }
    };
    loadTodos();
  }, []);

  // Save todos to AsyncStorage whenever the todos array changes
  useEffect(() => {
    const saveTodos = async () => {
      try {
        await AsyncStorage.setItem("todos", JSON.stringify(todos)); // Store todos as JSON string
      } catch (error) {
        console.error("Error saving todos to AsyncStorage:", error);
      }
    };
    saveTodos();
  }, [todos]); // This effect runs whenever the todos array changes

  // ----- CRUD functions -------
  function addTodo() {
    if (text.trim()) {
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      const newTodo = { id: newId, title: text, completed: false };
      setTodos([newTodo, ...todos]); // Add new todo to the list
      setText(""); // Clear the input field
    }
  }
  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  // each todo list component
  const Item = ({ item }) => {
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingText, setEditingText] = useState("");

    return (
      <View
        style={[styles.item, item.completed && { backgroundColor: "#a5fabd" }]}
      >
        <Pressable
          style={styles.iconContainer}
          onPress={() => toggleTodo(item.id)}
        >
          <Feather
            name={item.completed ? "check-square" : "square"}
            size={24}
            color="black"
          />
        </Pressable>

        {editingTodoId === item.id ? (
          <TextInput
            style={styles.todoText}
            value={editingText}
            onChangeText={setEditingText}
            onBlur={() => {
              // Save edited todo when input loses focus
              const updatedTodos = todos.map((todo) =>
                todo.id === item.id ? { ...todo, title: editingText } : todo
              );
              setTodos(updatedTodos);
              setEditingTodoId(null);
            }}
          />
        ) : (
          <Text
            style={styles.todoText}
            onPress={() => {
              setEditingTodoId(item.id);
              setEditingText(item.title);
            }}
          >
            {item.title}
          </Text>
        )}

        <View
          style={{ padding: 5, backgroundColor: "white", borderRadius: 15 }}
        >
          <Pressable onPress={() => removeTodo(item.id)}>
            <MaterialCommunityIcons name="delete" size={25} color="#e30b1a" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Hello!</Text>
        <Text style={styles.subtitle}>What are you going to do?</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a todo..."
            placeholderTextColor="gray"
            value={text}
            onChangeText={(value) => setText(value)}
            onSubmitEditing={addTodo}
            returnKeyType="done"
          />
          <View style={styles.buttonContainer}>
            <Pressable onPress={() => setText("")} style={styles.button}>
              <AntDesign name="closecircle" size={20} color="#e30b1a" />
            </Pressable>
            <Pressable onPress={addTodo} style={styles.button}>
              <AntDesign name="pluscircle" size={24} color="#0fd937" />
            </Pressable>
          </View>
        </View>
        <Text style={styles.todoListText}>Your To-Do List:</Text>
      </View>

      <View style={styles.todosContainer}>
        <FlatList
          data={todos}
          renderItem={({ item }) => <Item item={item} />}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", fontSize: 15, fontStyle: "italic" }}
            >
              No todos yet!
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#0f0e17",
  },
  titleContainer: {
    paddingTop: 40,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#6366f1",
  },
  title: {
    fontSize: 35,
    color: "#E2E8F0",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    borderRadius: 10, // Rounded corners
    fontWeight: "bold",
    color: "#E2E8F0",
    marginTop: 15,
    marginBottom: 15,
  },
  inputContainer: {
    display: "flex",
    gap: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 3,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 5,
  },
  input: {
    flex: 1,
    fontSize: 15,
    width: "100%",
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
  },
  todoListText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginTop: 20,
  },
  todosContainer: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 1, // Ensure it expands and scrolls
    backgroundColor: "white",
  },

  item: {
    fontSize: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 5,
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  todoText: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    marginLeft: 10,
  },
  iconContainer: {
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
