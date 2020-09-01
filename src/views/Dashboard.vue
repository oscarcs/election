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
                    <p class="mt-1 mb-1" v-html="whosWinningText"></p>
                    <PollingChartViewer />
                </article>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import ICountUp from 'vue-countup-v2';
import moment from 'moment';
import PollingChartViewer from '@/components/PollingChartViewer.vue';
import Config from '@/config';
import { Util, Parliament } from '@/util';

export default Vue.extend({
    name: 'Dashboard' as string,
    components: {
        ICountUp,
        PollingChartViewer
    },
    data() {
        return {
            predictedResult: {} as Parliament,
            polls: []
        };
    },
    mounted () {
        fetch(`${Config.baseUrl}/polls`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                this.polls = data.rows.slice(0, 5);
                const pollingAverage = Util.calculatePollingAverage(this.polls);
                this.predictedResult = Util.calculateSeatsFromPoll(pollingAverage, Util.guessElectorateSeats(pollingAverage));
                this.predictedResult.parties.sort((a, b) => b.quota - a.quota);
            });
    },
    methods: {

    },
    computed: {
        daysUntilElectionDay(): number {
            const electionDay = moment("2020-10-17");
            const diff = electionDay.diff(moment(), "days", true);
            return Math.ceil(diff);
        },

        daysUntilVotingStarts(): number {
            const votingStarts = moment("2020-10-03");
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
            let str = '';
            if (this.predictedResult.parties) {
                if (this.polls.length > 1) {
                    str = `Average number of seats on last ${this.polls.length} polls: `;
                }
                else {
                    str = `Number of seats on last poll: `;
                }
                
                str += this.predictedResult.parties.map(x => {
                    return `<span class="has-text-${Util.getPartyTextCSSName(x.name)}">${Util.getPartyName(x.name)} ${x.quota}</span>`;
                }).join(', ') + '.';

                const topParty = this.predictedResult.parties[0];
                if (topParty.quota >= this.predictedResult.seats / 2) {
                    str += '<br />';

                    const clazz = Util.getPartyTextCSSName(topParty.name);
                    const name = Util.getPartyName(topParty.name);

                    str += `<span class="has-text-${clazz}">${name}</span> will likely be able to govern alone ` + 
                        `in a ${this.predictedResult.seats}-seat Parliament.`;
                }
            }
            return str;
        }
    }
});
</script>
