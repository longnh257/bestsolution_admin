import axios from "axios";
import { defineStore } from "pinia";

interface JobListState {
  jobs: any[],
  totalPage: number,
  recPerPage: number,
  page: number,
  txtSearch: string,
  msg: string,
  loading: boolean
}

export const useJobListStore = defineStore("JobList", {
  state: (): JobListState => (
    {
      jobs: [],
      totalPage: 10,
      recPerPage: 10,
      page: 1,
      msg: "",
      txtSearch: "",
      loading: false,
    }
  ),
  getters: {

  },
  actions: {
    async getJobList(): Promise<void> {
      this.loading = true

      const res = await axios.get("job/list-job", {
        params: {
          page: this.page,
          txt_search: this.txtSearch,
          num_per_page: this.recPerPage,
        },
      })
      this.jobs = res.data.data
      this.totalPage = res.data.total_page

      this.loading = false
      console.log(this.jobs);

    },
    async getJobListApproved(): Promise<void> {
      this.loading = true

      const res = await axios.get("job/list-job",)
      this.jobs = res.data.data
      this.totalPage = res.data.total_page
      this.loading = false
      console.log(this.jobs);

    },
    async approveJob(selectedId: number, index: number = NaN): Promise<void> {
      return await axios
        .post(
          "job/approve",
          { id: selectedId },
        ).then((res) => {
          if(index) {
            this.jobs[index].status = 1
            this.jobs[index].partner.is_approve = 1
          }
          this.msg = res.data.message
        }).catch((res) => {
        })
    },
    async activeJob(selectedId: number, index: number): Promise<void> {
      return await axios
        .post(
          "job/active",
          { id: selectedId },
        ).then((res) => {
          console.log(res.data.message);

          this.msg = res.data.message
          this.jobs[index].status = !this.jobs[index].status
        }).catch((res) => {
          this.msg = res.data.message
        })
    },
    async deleteJob(selectedId: number): Promise<void> {
      return await axios
        .post(
          "admin/delete-job",
          { id: selectedId },
        ).then((res) => {
          this.msg = res.data.message
          this.jobs = this.jobs.filter(item => {
            return item.id !== selectedId
          })
        }).catch((res) => {
          this.msg = res.data.message
        })
    },
  }
})