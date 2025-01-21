const EnquiryIntakeForm = (() => {

    const debug = (stringToLog) => {
        console.log(`<<< ${stringToLog} >>>`);
    };

    const transitionSpeed = "fast"; // "slow", "fast", "normal", [duration in ms]

    const enquiryTypeMapping = {
        // TODO: Environment variable?
        224530000: "Yes, about this matter",        // 'Update on Existing Issue' in Global Choice mlc_enquirytype and Local Choice Enquiry.cfp_enquirytype
        224530001: "Yes, about a different matter", // 'Existing Client with New Issue' in Global Choice mlc_enquirytype and Local Choice Enquiry.cfp_enquirytype 
        224530002: "No, this is the first time"     // 'New Client with a New Issue' in Global Choice mlc_enquirytype and Local Choice Enquiry.cfp_enquirytype
    };

    const elements = { };

    const getRandomString = (length = 4) => {
        const indexEnd = length + 2;
        return Math.random().toString(36).substring(2, indexEnd).toUpperCase();
    }
    const createHeadingRow = (text) => {
        return($(`<tr><td colspan="2"><p>${text}</p></td></tr>`));
    };

    const createElements = () => {
        const additionalParty1Header = createHeadingRow("Other Party involved in the issue");
        additionalParty1Header.insertBefore(elements.additionalParty1FirstNameContainer);

        const additionalParty2Header = createHeadingRow("First Additional Party");
        additionalParty2Header.insertBefore(elements.additionalParty2FirstNameContainer);

        const additionalParty3Header = createHeadingRow("Second Additional Party");
        additionalParty3Header.insertBefore(elements.additionalParty3FirstNameContainer);
    };

    const getElements = () => {

        // Elements that will be hidden by default, but shown to the user in certain conditions:
        elements.enquiryTypeInput = $("#mlc_enquirytype");

        elements.yearOfArrivalInput = $("#mlc_yearofarrival");
        elements.yearOfArrivalContainer = elements.yearOfArrivalInput?.closest("tr");

        elements.visaTypeInput = $("#mlc_visatype");
        elements.visaTypeContainer = elements.visaTypeInput?.closest("tr");

        // Section that will be hidden unless/until Safety Concern Indicator === Yes:
        elements.safetyConcernsTable = $('table[data-name="safety_concerns"]');
        elements.safetyConcernsSection = elements.safetyConcernsTable?.closest("fieldset");
        
        // Section that will be hidden unless/until Add Additional Parties === Yes:
        elements.additionalPartiesTable = $('table[data-name="additional_parties"]');
        elements.additionalPartiesSection = elements.additionalPartiesTable?.closest("fieldset");

        // Section that will be hidden unless/until Add Key Dates === Yes:
        elements.keyDatesTable = $('table[data-name="key_dates"]');
        elements.keyDatesSection = elements.keyDatesTable?.closest("fieldset");

        // Section that will be hidden unless/until Add Specific Questions === Yes
        elements.specificQuestionsTable =  $('table[data-name="specific_questions"]');
        elements.specificQuestionsSection = elements.specificQuestionsTable?.closest("fieldset"); 

        // Hidden section, which will not be shown to the user:
        elements.basicDetailsTable = $('table[data-name="basic_details"]');
        elements.basicDetailsSection = elements.basicDetailsTable?.closest("fieldset");

        // Hidden fields with values that will be populated by this script:
        elements.name = $("#mlc_name");
        elements.origin = $("#mlc_origin");
        elements.originEntity = $("#mlc_origin_entityname");

        // Elements which we'll need to prepend with headings,:
        elements.additionalParty1FirstNameInput = $("#mlc_additionalparty1firstname");
        elements.additionalParty1FirstNameContainer = elements.additionalParty1FirstNameInput?.closest("tr");
        elements.additionalParty2FirstNameInput = $("#mlc_additionalparty2firstname");
        elements.additionalParty2FirstNameContainer = elements.additionalParty2FirstNameInput?.closest("tr");
        elements.additionalParty3FirstNameInput = $("#mlc_additionalparty3firstname");
        elements.additionalParty3FirstNameContainer = elements.additionalParty3FirstNameInput?.closest("tr");
        
        // Other elements which we'll need to read or manipulate:
        elements.countryOfBirth = $("#mlc_countryofbirth");
        elements.countryOfBirthName = $("#mlc_countryofbirth_name");
        elements.safetyConcernSimpleIndicator = $("#mlc_safetyconcernsimpleindicator");
        elements.addAdditionalParties = $("#mlc_addadditionalparties");
        elements.addKeyDates = $("#mlc_addkeydates");
        elements.addSpecificQuestions = $("#mlc_addspecificquestions");
        elements.specificQuestionsInputs = $("#mlc_question1, #mlc_question2, #mlc_question3");
    };

    const hideElements = (...elements) => {
        elements.forEach(element => element?.hide());
    };

    const setValues = () => {
        // Set values of hidden fields:
        elements.name?.val(`Enquiry Intake - ${getRandomString(4)}`);
        elements.origin?.val("53f4cd22-d597-ee11-be37-000d3a79efd0");   // TODO: Environment variable?
        elements.originEntity?.val("cfp_origin");

        // Add placeholder text to the Specific Question fields:
        elements.specificQuestionsInputs.attr("placeholder", "Enter your question here.");
        
        // Change the text content of the option elements in the Enquiry Type's select input:
        elements.enquiryTypeInput?.find("option").each(function() {
            const optionValue = $(this).val();
            if (enquiryTypeMapping[optionValue] !== undefined) {
                $(this).text(enquiryTypeMapping[optionValue]);
            }
        });
    };

    const addEventListeners = () => {
        elements.countryOfBirth.on("change", function() {
            if ((elements.countryOfBirthName.val()?.toUpperCase() === "AUSTRALIA") || (elements.countryOfBirthName.val()?.toUpperCase() === "")) {
                elements.visaTypeContainer.fadeOut(transitionSpeed).find(":input").val("");
                elements.yearOfArrivalContainer.fadeOut(transitionSpeed).find(":input").val("");   
            } else {
                elements.visaTypeContainer.fadeIn(transitionSpeed);
                elements.yearOfArrivalContainer.fadeIn(transitionSpeed);
            }
        });

        // The inputs for columns that are controlled by custom code components are hidden, and therefore don't emit change (etc) events.
        // Instead, we need to use the mutation observer API to watch for changes to the value of those inputs, and respond accordingly:
        observeValueChange("#mlc_safetyconcernsimpleindicator");
        observeValueChange("#mlc_addkeydates");
        observeValueChange("#mlc_addadditionalparties");
        observeValueChange("#mlc_addspecificquestions");
    };

    const observeValueChange = (selector) => {
        const element = $(selector)[0];
        if (!element) {
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "value") {
                    const newValue = $(element).val();
                    mutationActions[selector](newValue.toString());
                }
            });
        });

        observer.observe(element, {
            attributes: true,
            attributeFilder: ["value"]
        })
    };

    const mutationActions = {
        "#mlc_safetyconcernsimpleindicator": (newValue) => {
            if (newValue === 'true') {
                elements.safetyConcernsSection.fadeIn(transitionSpeed);
            } else {
                elements.safetyConcernsSection.fadeOut(transitionSpeed).find(":input").val(""); // TODO: This does not clear UI of multi-select PCF (MscrmControls.MultiSelectPickList)
            }
        },
        "#mlc_addadditionalparties": (newValue) => {
            if (newValue === 'true') {
                elements.additionalPartiesSection.fadeIn(transitionSpeed);
            } else {
                elements.additionalPartiesSection.fadeOut(transitionSpeed).find(":input").val(""); 
            }
        },
        "#mlc_addkeydates": (newValue) => {
            if (newValue === 'true') {
                elements.keyDatesSection.fadeIn(transitionSpeed);
            } else {
                elements.keyDatesSection.fadeOut(transitionSpeed).find(":input").val(""); 
            }
        },
        "#mlc_addspecificquestions": (newValue) => {
            if (newValue === 'true') {
                elements.specificQuestionsSection.fadeIn(transitionSpeed);
            } else {
                elements.specificQuestionsSection.fadeOut(transitionSpeed).find(":input").val(""); 
            }
        }
    }
 
    const initializeForm = () => {
        getElements();
        hideElements(
            elements.yearOfArrivalContainer, 
            elements.visaTypeContainer, 
            elements.safetyConcernsSection,
            elements.additionalPartiesSection,
            elements.keyDatesSection,
            elements.specificQuestionsSection,
            elements.basicDetailsSection,
        );
        setValues();
        createElements();
        addEventListeners();
    };

    return {
        debug, 
        initializeForm
    };
})();

EnquiryIntakeForm.initializeForm();