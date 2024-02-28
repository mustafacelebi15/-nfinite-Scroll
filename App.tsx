import React from "react";
import { SafeAreaView, Text, View, ActivityIndicator, FlatList} from "react-native";
import axios from "axios";

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      list: [],
      page: 0,
      limit: 2,
      loading: false,
      totalDataCount: 10,
    };
  }

  componentDidMount() {
    this.getUserList();
  }

  getUserList = () => {
    const { list, page, limit, totalDataCount } = this.state;

    if (page >= totalDataCount) {
      return;
    }

    this.setState({ loading: true });

    axios.get(`https://jsonplaceholder.typicode.com/users?_start=${page}&_limit=${limit}`)
      .then(res => {
        this.setState({
          list: page === 0 ? res.data : [...list, ...res.data],
          loading: false
        }, () => console.log(this.state));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        this.setState({ loading: false });
      });
  }

  getMoreUserList = () => {
    if (!this.state.loading) {
      this.setState(
        (prevState) => ({
          page: prevState.page + 2,
        }),
        this.getUserList
      );
    }
  };

  footerIndicator = () => {
    return this.state.loading ? (
      <View
        style={{
          paddingVertical: 20,
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    ) : null;
  };

  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={this.state.list}
          renderItem={({ item }) => (
            <ShowUsers item={item} />
          )}
          keyExtractor={item => item.id.toString()}
          onEndReached={this.getMoreUserList}
          ListFooterComponent={this.footerIndicator}
          onEndReachedThreshold={0.1}
        />
      </SafeAreaView>
    )
  }
}

const ShowUsers = (props) => {
  return (
    <View style={{ padding: 40, borderBottomWidth: 1, borderBottomColor: 'black' }}>
      <Text>{`ID: ${props.item.id}`}</Text>
      <Text>{`Name: ${props.item.name}`}</Text>
      <Text>{`Username: ${props.item.username}`}</Text>
      <Text>{`Email: ${props.item.email}`}</Text>
      <Text>{`Website: ${props.item.website}`}</Text>
    </View>
  )
}
