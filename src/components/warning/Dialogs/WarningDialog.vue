<template>
  <div>
    <SnackBar :SnackBarComponent="SnackBarComponent" />
    <v-dialog :model-value="DialogWarning" persistent max-width="400px">
      <v-card>
        <v-toolbar
          v-if="$route.name == 'VerifiedPov'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "INACTIVE" ? "mdi-close-outline" : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action2 == 'DISAPPROVE'
                ? 'DisApprove POV'
                : StoreObj.Action == 'INACTIVE'
                ? 'Deactivate POV'
                : 'Activate User'
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'Designation'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "INACTIVE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="StoreObj.Action == 'DEACTIVATE' ? 'Dis ' : 'Activate '"
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Notifications'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'povRemarks'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'CustomerJourney'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'LeaveBehind'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'CampaignTagging'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'TerritoryCategory'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Sample'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Division'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'CME'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'DrugType'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "DEACTIVATE"
                ? "mdi-close-outline"
                : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'DoctorCategory'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE' ? 'Deactivate ' : 'Activate '
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'Users'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "INACTIVE" ? "mdi-close-outline" : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action == 'INACTIVE'
                ? 'Deactivate User'
                : 'Activate User'
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'MedReps'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "DEACTIVATE"
                ? "mdi-close-outline"
                : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? 'Deactivate User'
                : 'Activate User'
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Drugslist'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "DEACTIVATE"
                ? "mdi-close-outline"
                : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? 'Deactivate Drug'
                : 'Activate Drug'
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Territories'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? 'Deactivate Territory'
                : 'Activate Territory'
            "
          ></div>
          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-toolbar
          v-if="$route.name == 'Povlist'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">{{
            StoreObj.Action == "DEACTIVATE" ? "mdi-close-outline" : "mdi-check"
          }}</v-icon>
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? 'Deactivate Povlist'
                : 'Activate Povlist'
            "
          ></div>

          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-toolbar
          v-if="$route.name == 'Specialization'"
          density="compact"
          dark
          color="gradient-bg"
          class="elevation-0"
        >
          <v-icon small class="mr-2">
            {{
              StoreObj.Action == "DEACTIVATE"
                ? "mdi-close-outline"
                : "mdi-check"
            }}</v-icon
          >
          <div
            v-text="
              StoreObj.Action == 'DEACTIVATE'
                ? 'Deactivate SPECIALIZATION'
                : 'Activate SPECIALIZATION'
            "
          ></div>

          <v-spacer />
          <v-btn icon @click="WarningEmit((Toggle = 1))">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-center pb-0">
          <v-icon
            v-if="$route.name == 'Users'"
            size="60px"
            :color="StoreObj.Action == 'INACTIVE' ? 'red' : 'green'"
            class="mt-4"
          >
            {{
              StoreObj.Action == "INACTIVE" ? "mdi-close-outline" : "mdi-check"
            }}</v-icon
          >
          <v-icon
            v-if="
              $route.name == 'MedReps' ||
              $route.name == 'Drugslist' ||
              $route.name == 'Territories' ||
              $route.name == 'Povlist' ||
              $route.name == 'Specialization' ||
              $route.name == 'DrugType' ||
              $route.name == 'CampaignTagging' ||
              $route.name == 'Sample' ||
              $route.name == 'CME' ||
              $route.name == 'Division' ||
              $route.name == 'Designation' ||
              $route.name == 'DoctorCategory' ||
              $route.name == 'LeaveBehind' ||
              $route.name == 'TerritoryCategory' ||
              $route.name == 'povRemarks' ||
              $route.name == 'CustomerJourney' ||
              $route.name == 'Notifications' ||
              $route.name == 'VerifiedPov'
            "
            size="60px"
            :color="
              StoreObj.Action == 'DEACTIVATE' || StoreObj.Action == 'INACTIVE'
                ? 'red'
                : 'green'
            "
            class="mt-4"
            >{{
              StoreObj.Action == "DEACTIVATE" || StoreObj.Action == "INACTIVE"
                ? "mdi-close-outline"
                : "mdi-check"
            }}</v-icon
          >
          <div v-if="$route.name == 'Designation'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.designation_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Division'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.setting_name }}</span> ?
          </div>
          <div v-if="$route.name == 'povRemarks'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.setting_name }}</span> ?
          </div>

          <div v-if="$route.name == 'CustomerJourney'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.setting_name }}</span> ?
          </div>

          <div v-if="$route.name == 'Notifications'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.setting_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Specialization'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.specialization_name }}</span> ?
          </div>
          <div v-if="$route.name == 'DoctorCategory'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.pov_category_name }}</span> ?
          </div>
          <div v-if="$route.name == 'DrugType'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.catalog_type_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Sample'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.product_name }}</span> ?
          </div>
          <div v-if="$route.name == 'CME'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            >
            </span>
            <span>{{ " " + StoreObj.cme_topic }}</span>
          </div>
          <div v-if="$route.name == 'TerritoryCategory'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.territory_category_name }}</span> ?
          </div>
          <div v-if="$route.name == 'CampaignTagging'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.gift_name }}</span> ?
          </div>
          <div v-if="$route.name == 'LeaveBehind'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.leave_behind_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Povlist'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.pov_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Territories'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.territory_name }}</span> ?
          </div>
          <div v-if="$route.name == 'MedReps'">
            <span
              v-text="
                StoreObj.Action == 'DEACTIVATE' ? 'Deactivate' : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.user_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Users'">
            <span
              v-text="StoreObj.Action == 'INACTIVE' ? 'Deactivate' : 'Activate'"
            ></span>
            <span>{{ " " + StoreObj.user_name }}</span> ?
          </div>
          <div v-if="$route.name == 'Drugslist'">
            <span
              v-text="StoreObj.Action == 'INACTIVE' ? 'Deactivate' : 'Activate'"
            ></span>
            <span>{{ " " + StoreObj.catalog_name }}</span> ?
          </div>
          <div v-if="$route.name == 'VerifiedPov'">
            <span
              v-text="
                StoreObj.Action2 == 'DISAPPROVE'
                  ? 'Disapprove'
                  : StoreObj.Action == 'INACTIVE'
                  ? 'Deactivate'
                  : 'Activate'
              "
            ></span>
            <span>{{ " " + StoreObj.pov_name }}</span> ?
          </div>
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-spacer />
          <v-btn small text color="primary" @click="WarningEmit((Toggle = 1))"
            >Cancel</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Designation'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateDesignation((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Notifications'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateDesignation((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Division'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateDesignation((Toggle = 1))"
            >Confirm</v-btn
          >

          <v-btn
            small
            tile
            v-if="$route.name == 'povRemarks'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateCamaignTagging((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'CustomerJourney'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateCamaignTagging((Toggle = 1))"
            >Confirm</v-btn
          >

          <v-btn
            small
            tile
            v-if="$route.name == 'VerifiedPov'"
            :loading="loading"
            class="primary"
            @click="ActivateInActivePovlist((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Users'"
            :loading="loading"
            class="primary"
            @click="ActivateInActiveUser((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'MedReps'"
            :loading="loading"
            class="primary"
            @click="ActivateInActiveMedRep((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Drugslist'"
            :loading="loading"
            class="primary"
            @click="ActivateInActiveMedDrugs((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Territories'"
            :loading="loading"
            class="primary"
            @click="ActivateInActiveTerritory((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Povlist'"
            :loading="loading"
            class="primary"
            @click="ActivateInActivePovlist((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'DoctorCategory'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivatePOVsCategory((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'DrugType'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateCatalogType((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Sample'"
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateTerritoryCategory((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            v-if="$route.name == 'CME'"
            small
            tile
            :loading="loading"
            class="primary"
            @click="ActivateOrDeactivateTerritoryCategory((Toggle = 1))"
            >Confirm
          </v-btn>
          <v-btn
            small
            tile
            v-if="$route.name == 'TerritoryCategory'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateCamaignTagging((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'LeaveBehind'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateCamaignTagging((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'CampaignTagging'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateCamaignTagging((Toggle = 1))"
            >Confirm</v-btn
          >
          <v-btn
            small
            tile
            v-if="$route.name == 'Specialization'"
            :loading="loading"
            class="primary"
            @click="activateOrDeactivateSpecialization((Toggle = 1))"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SnackBar from "@/components/SnackBar.vue";
import {
  DeactiveOrActivateSpecialization,
  ActivateOrDeactivateUser,
  ActivateOrDeactivateMedRep,
  ActivateOrDeactivateCatalog,
  ActivateOrDeactivateTerritory,
  ActivateOrDeactivatePOV,
  ActivateOrDeactivateDesignation,
  ActivateOrDeactivateCatalogType,
  ActivateOrDeactivatePOVsCategory,
  ActivateOrDeactivateTerritoryCategory,
  ActivateOrDeactivateSetting,
} from "@/graphql/mutations.js";
import { generateClient } from "aws-amplify/api";
const client = generateClient();
export default {
  props: {
    StoreObj: Object,
    DialogWarning: Boolean,
    GetCurrentUserDetailsObj: Object,
  },
  components: {
    SnackBar,
  },
  data: () => ({
    Toggle: 0,
    loading: false,
    SnackBarComponent: {},
  }),
  watch: {
    DialogWarning(val) {
      if (val == true) {
        console.warn(val);
        this.DialogWarning = true;
      }
    },
  },
  methods: {
    async activateOrDeactivateSpecialization() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          specialization_id: this.StoreObj.specialization_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };

        let result = await client.graphql({
          query: DeactiveOrActivateSpecialization,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.DeactiveOrActivateSpecialization,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async activateOrDeactivateCamaignTagging() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          setting_id: this.StoreObj.setting_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };

        let result = await client.graphql({
          query: ActivateOrDeactivateSetting,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateSetting);
        if (ResultObject.status == "SUCCESS") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateOrDeactivateTerritoryCategory() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          setting_id: this.StoreObj.setting_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };

        let result = await client.graphql({
          query: ActivateOrDeactivateTerritoryCategory,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateTerritoryCategory,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateOrDeactivatePOVsCategory() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          setting_id: this.StoreObj.setting_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };

        let result = await client.graphql({
          query: ActivateOrDeactivatePOVsCategory,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivatePOVsCategory,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateOrDeactivateCatalogType() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          setting_id: this.StoreObj.setting_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateCatalogType,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateCatalogType,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateOrDeactivateDesignation() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          setting_id: this.StoreObj.setting_id,
          action:
            this.StoreObj.Action == "DEACTIVATE" ? "DEACTIVATE" : "ACTIVATE",
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateDesignation,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateDesignation,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },

    async ActivateInActivePovlist() {
      //  var inputparams = {
      //     organization_id: this.GetCurrentUserDetailsObj.organization_id,
      //     updater_user_id: this.GetCurrentUserDetailsObj.user_id,
      //     pov_id: this.StoreObj.pov_id,
      //     action:this.checkdeactivate (this.StoreObj.Action) ,
      //   };
      // console.log("input",inputparams)
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          pov_id: this.StoreObj.pov_id,
          action:
            this.StoreObj.Action2 == "DISAPPROVE" &&
            this.StoreObj.Action2 != undefined
              ? "DISAPPROVE"
              : this.checkdeactivate(this.StoreObj.Action),
        };
        let result = await client.graphql({
          query: ActivateOrDeactivatePOV,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivatePOV);
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },

    checkdeactivate(val) {
      console.log("val", val);
      if (val == "INACTIVE") {
        return "DEACTIVATE";
      } else if (val == "DEACTIVATE") {
        return "DEACTIVATE";
      } else {
        return "ACTIVATE";
      }
    },
    async ActivateInActiveTerritory() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          territory_id: this.StoreObj.territory_id,
          action: this.StoreObj.Action,
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateTerritory,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(
          result.data.ActivateOrDeactivateTerritory,
        );
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateInActiveMedDrugs() {
      try {
        this.loading = true;
        var inputparams = {
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          catalog_id: this.StoreObj.catalog_id,
          action: this.StoreObj.Action,
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateCatalog,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateCatalog);
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateInActiveMedRep() {
      try {
        this.loading = true;
        var inputparams = {
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          user_id: this.StoreObj.user_id,
          action: this.StoreObj.Action,
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateMedRep,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateMedRep);
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        console.warn("error", error);
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    async ActivateInActiveUser() {
      try {
        this.loading = true;
        var inputparams = {
          updater_user_id: this.GetCurrentUserDetailsObj.user_id,
          organization_id: this.GetCurrentUserDetailsObj.organization_id,
          user_id: this.StoreObj.user_id,
          action:
            this.StoreObj.Action == "INACTIVE" ? "DEACTIVATE" : "ACTIVATE",
        };
        let result = await client.graphql({
          query: ActivateOrDeactivateUser,
          variables: {
            input: inputparams,
          },
        });
        this.loading = false;
        var ResultObject = JSON.parse(result.data.ActivateOrDeactivateUser);
        if (ResultObject.status == "Success") {
          this.SnackBarComponent = {
            SnackbarVmodel: true,
            SnackbarColor: "primary",
            SnackbarText: ResultObject.Status_Message,
            Top: true,
            timeout: 2000,
          };
          this.WarningEmit((this.Toggle = 2));
        }
      } catch (error) {
        this.loading = false;
        this.SnackBarComponent = {
          SnackbarVmodel: true,
          SnackbarColor: "red",
          SnackbarText: error.errors[0].message,
          Top: true,
          timeout: 2000,
        };
      }
    },
    WarningEmit(Toggle) {
      this.$emit("clicked", Toggle);
    },
  },
};
</script>
<style scoped>
.gradient-btn {
  background: -webkit-linear-gradient(145deg, #0a876e 30%, #0fc566 80%);
  -webkit-text-fill-color: white;
}
.gradient-bg {
  background: -webkit-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -moz-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -o-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: -ms-linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
  background: linear-gradient(145deg, #0fc566 0%, #0a876e 100%);
}
</style>
