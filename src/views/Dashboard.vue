<template>
    <div class="tile is-ancestor">
        <div class="tile is-vertical">
            <div class="tile">
                <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-orange has-text-centered">
                        <p class="is-size-2">
                            <ICountUp
                                :delay="0"
                                :endVal="daysUntilElectionDay"
                                :options="{ duration: 1.5 }"
                            />
                        </p>
                        <p class="is-size-6">Day{{daysUntilElectionDay === 1 ? '' : 's'}} until Election Day</p>
                    </article>
                </div>
                <div class="tile is-parent is-4">
                    <article class="tile is-child notification is-orange2 has-text-centered">
                        <p class="is-size-2">
                            <ICountUp
                                :delay="0"
                                :endVal="daysUntilVotingStarts"
                                :options="{ duration: 1.5 }"
                            />
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
                    <p class="is-size-6">Overview</p>
                </article>
            </div>
        </div>
    </div>
</template>

<script>
import ICountUp from "vue-countup-v2";
import * as moment from "moment";

export default {
    name: "Dashboard",
    components: {
        ICountUp
    },
    computed: {
        daysUntilElectionDay() {
            const electionDay = moment('2020-09-19');
            const diff = electionDay.diff(moment(), 'days', true);
            return Math.ceil(diff);
        },
        
        daysUntilVotingStarts() {
            const votingStarts = moment('2020-09-05');
            const diff = votingStarts.diff(moment(), 'days', true);
            return Math.ceil(diff);
        },

        regulatedPeriodNumber() {
            const regulatedPeriod = moment('2020-06-19');
            const diff = regulatedPeriod.diff(moment(), 'days', true);
            return Math.ceil(diff);
        },

        regulatedPeriodText() {
            const s = Math.abs(this.regulatedPeriodNumber) === 1 ? '' : 's';
            return this.regulatedPeriodNumber > 0 ? 
                `Day${s} until the regulated period` :
                `Day${s} into the regulated period`;
        }
    }
};
</script>
