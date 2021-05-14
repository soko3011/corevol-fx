<template>
  <div>
    <div v-if="loaded">
      <ChatSearchTable
        :apidata="data_table_data"
        :headerData="`${selectedCross} - SEARCH`"
        :selectedRow="sentence_index_on_chat_slice"
        :key="componentKey"
        class="ml-1"
      />
    </div>
  </div>
</template>

<script>
import NlpApi from "@/apis/pythonApis/NlpApi";
import ChatSearchTable from "@/components/NlpModel/sharedComponents/chatSearch/ChatSearchTable.vue";

export default {
  name: "brokerChatNlp",
  components: {
    ChatSearchTable,
  },
  props: {
    date_str: { type: String },
    searchSentence: { type: String },
    selectedCross: { type: String },
  },

  data() {
    return {
      apiData: [],
      loaded: false,
      componentKey: 0,
      sentence_index_on_full_chat_data: 0,
    };
  },
  async created() {
    await this.getApiData();
    this.sentence_index_on_full_chat_data = this.apiData
      .map((a) => a.sentences)
      .indexOf(this.searchSentence);
    this.loaded = true;
  },
  computed: {
    data_table_data() {
      return this.apiData.slice(
        this.sentence_index_on_full_chat_data - 5,
        this.sentence_index_on_full_chat_data + 50
      );
    },
    sentence_index_on_chat_slice() {
      return this.data_table_data
        .map((a) => a.sentences)
        .indexOf(this.searchSentence);
    },
  },
  methods: {
    dev() {
      console.log(this.data_table_data);
    },
    async getApiData() {
      try {
        let response = await NlpApi.get_full_chat(this.date_str);
        this.apiData = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>


