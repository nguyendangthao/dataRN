import Expo, { SQLite } from 'expo';
import React from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, Platform } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
const db = SQLite.openDatabase('db.db');

export default class Detail extends React.Component {
    state = {
        name: '',
        dc: '',
        data: []
    };

    static navigationOptions = ({ navigation }) => {
        var a = navigation.getParam('itemId');

        return {
            title: navigation.state.params.title,
            headerRight: (
                <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#fff"
                />
            ),
            headerLeft: (<Button
                title="Go to home"
                onPress={() => {
                    navigation.navigate('home', {
                    });
                }}
            />),

        }

    };
    componentDidMount() {
        db.transaction(tx => {
            tx.executeSql(
                'create table if not exists detail (id integer primary key not null, name text, dc text);'
            );
            tx.executeSql('select * from detail where id > ? and id < ? ', [3, 10], (_, { rows }) => {
                this.setState({ data: rows._array })
            });
        });
    }
    add() {
        db.transaction(
            tx => {
                tx.executeSql('insert into detail (name, dc) values (?, ?)', [this.state.name, this.state.dc]);

                tx.executeSql('select * from detail', [], (_, { rows }) => {
                    this.setState({ data: rows._array })
                });
                // mot trong hai , parmar 1 thể hiện về db truyền gì cũng đc,
                //par2 truyền gì cũng đc nó là data truyên  rows đỡ phải gán
                tx.executeSql('select * from detail', [], function (tx, res) {
                    console.log("ssss" + res);
                });

            },
            null,
        );
    }
    xoa(id) {
        db.transaction(
            tx => {
                tx.executeSql(`delete from detail where id = ?;`, [id]);
                tx.executeSql('select * from detail', [], (_, { rows }) => {
                    this.setState({ data: rows._array })
                });
            });
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <TextInput
                        style={{
                            flex: 1,
                            padding: 5,
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                        }}
                        placeholder="what do you need to do?"
                        value={this.state.name}
                        onChangeText={name => this.setState({ name })}
                    />
                    <TextInput
                        style={{
                            flex: 1,
                            padding: 5,
                            height: 40,
                            borderColor: 'gray',
                            borderWidth: 1,
                        }}
                        placeholder="what do you need to do?"
                        value={this.state.dc}
                        onChangeText={dc => this.setState({ dc })}
                    />
                    <Button
                        title="add new"
                        onPress={() => this.add()}
                    />

                </View>
                <View style={{ flex: 1, backgroundColor: 'gray' }}>
                    <Button
                        title="Go to home"
                        onPress={() => {
                            this.props.navigation.dispatch(StackActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({ routeName: 'home' })
                                ],
                            }))
                        }}
                    />
                    <Text>{Platform.OS}</Text>
                </View>

                <FlatList
                    data={this.state.data}
                    renderItem={
                        ({ item }) =>
                             //<Text>{item.id}- {item.name}-{item.dc}</Text>
                            <View>
                                <Text>{item.id}- {item.name}-{item.dc}</Text>
                                <Button title="xoa" onPress={() => { this.xoa(item.id) }}></Button>
                            </View>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View >
        );
    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20
    },
});
