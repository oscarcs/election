<template>
    <div class="tile is-ancestor">
        <div class="tile is-vertical">
            <div class="tile">
                <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-orange has-text-centered">
                        <p class="is-size-2">
                            <ICountUp :delay="0" :endVal="daysUntilElectionDay" :options="{ duration: 1.5 }" />
                        </p>
                        <p class="is-size-6">Day{{daysUntilElectionDay === 1 ? '' : 's'}} until Election Day</p>
                    </article>
                </div>
                <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-orange2 has-text-centered">
                        <p class="is-size-2">
                            <ICountUp :delay="0" :endVal="daysUntilVotingStarts" :options="{ duration: 1.5 }" />
                        </p>
                        <p class="is-size-6">Days until voting starts</p>
                    </article>
                </div>
                <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-orange3 has-text-centered">
                        <p class="is-size-2">
                            <ICountUp
                                :delay="0"
                                :endVal="Math.abs(regulatedPeriodNumber)"
                                :options="{ duration: 1.5 }"
                            />
                        </p>
                        <p class="is-size-6">{{regulatedPeriodText}}</p>
                    </article>
                </div>
            </div>
            <div class="tile is-parent is-12">
                <article class="tile is-child notification is-slate">
                    <p class="is-size-5">Overview</p>
                    <p v-html="whosWinningText"></p>
                    <PollingViewer />
                </article>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ICountUp from 'vue-countup-v2';
import moment from 'moment';
import PollingViewer from '@/components/PollingViewer.vue';
import Config from '@/config';
import { Util, Parliament } from '@/util';

export default Vue.extend({
    name: 'Dashboard' as string,
    components: {
        ICountUp,
        PollingViewer
    },
    data() {
        return {
            predictedResult: {} as Parliament
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/polls`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                const poll = data.rows[data.rows.length - 1];
                this.predictedResult = Util.calculateSeatsFromPoll(poll, Util.guessElectorateSeats(poll));
            });
    },
    methods: {

    },
    computed: {
        daysUntilElectionDay(): number {
            const electionDay = moment("2020-09-19");
            const diff = electionDay.diff(moment(), "days", true);
            return Math.ceil(diff);
        },

        daysUntilVotingStarts(): number {
            const votingStarts = moment("2020-09-05");
            const diff = votingStarts.diff(moment(), "days", true);
            return Math.ceil(diff);
        },

        regulatedPeriodNumber(): number {
            const regulatedPeriod = moment("2020-06-19");
            const diff = regulatedPeriod.diff(moment(), "days", true);
            return Math.ceil(diff);
        },

        regulatedPeriodText(): string {
            const s = Math.abs(this.regulatedPeriodNumber) === 1 ? "" : "s";
            return this.regulatedPeriodNumber > 0
                ? `Day${s} until the regulated period`
                : `Day${s} into the regulated period`;
        },

        whosWinningText(): string {
            // if (this.predictedResult.parties) {
            //     return `<span class="is-labour">Labour</span> looks like they will win the election ` + 
            //         `with <b>${this.predictedResult.parties.find(x => x.name === 'LAB')?.quota ?? 0}</b> seats.`;
            // }
            if (this.predictedResult.parties) {
                return this.predictedResult.parties.map(x => `${x.name}: ${x.quota}`).join(' | ');
            }
            return '';
        }
    }
});
</script>
