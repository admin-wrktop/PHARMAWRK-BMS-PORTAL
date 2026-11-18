import {
    Bar
} from "vue-chartjs";

export default {
    extends: Bar,
    props: {
        chartdata: {
            type: Object,
            default: null,
        },
        options: {
            type: Object,
            default: null,
        },
        count: Number
    },
    mounted() {  this.renderChart(this.chartdata, this.options);},
    watch: {
        count(val) {
            if (val == 1) {
                this.renderChart(this.chartdata, this.options);

            }
        }
    },
};