import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
	const colors = {
		visa: ["#436D99", "#2D57F2"],
		mastercard: ["#DF6F29", "#C69347"],
		elo: ["#000000", "#DF2929"],
		nubank: ["#4508F3", "#BA00FC"],
		default: ["black", "gray"],
	}
	ccBgColor01.setAttribute("fill", colors[type][0])
	ccBgColor02.setAttribute("fill", colors[type][1])
	ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

// CVC code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
	mask: "000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

// Date expiration
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
	mask: "MM{/}YY",
	blocks: {
		MM: {
			mask: IMask.MaskedRange,
			from: 1,
			to: 12,
		},
		YY: {
			mask: IMask.MaskedRange,
			from: String(new Date().getFullYear()).slice(2),
			to: String(new Date().getFullYear() + 10).slice(2),
		},
	},
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

// Card Number
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
	mask: [
		{
			mask: "0000 0000 0000 0000",
			regex: /^4\d{0,15}/,
			cardtype: "visa",
		},
		{
			mask: "0000 0000 0000 0000",
			regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
			cardtype: "mastercard",
		},
		{
			mask: "0000 0000 0000 0000",
			regex: /^6\d{0,15}/,
			cardtype: "elo",
		},
		{
			mask: "0000 0000 0000 0000",
			regex: /^8\d{0,15}/,
			cardtype: "nubank",
		},
		{
			mask: "0000 0000 0000 0000",
			cardtype: "default",
		},
	],
	dispatch: function (appended, dynamicMasked) {
		const number = (dynamicMasked.value + appended).replace(/\D/g, "")
		const foundMask = dynamicMasked.compiledMasks.find(function (item) {
			return number.match(item.regex)
		})
		return foundMask
	},
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

// Event Button add
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", (event) => {
	event.preventDefault()
	if (validaForm()) alert("Cartão adicionado com sucesso!!!")
})

// Event CardName
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
	const ccHolder = document.querySelector(".cc-holder .value")
	ccHolder.innerText =
		cardHolder.value.length === 0 ? "NOME DO CLIENTE" : cardHolder.value
	// ccHolder.innerText = cardHolder.value ? cardHolder.value : "NOME DO CLIENTE"
})

// Validation Form

const formulario = document.querySelector("form")
function validaForm() {
	return formulario.reportValidity()
}

//Event Mask SecurityCode
securityCodeMasked.on("accept", () => {
	updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code) {
	const ccSecurity = document.querySelector(".cc-security .value")
	ccSecurity.innerText = code.length === 0 ? "123" : code
}

//Event NumberCard
cardNumberMasked.on("accept", () => {
	const cardType = cardNumberMasked.masked.currentMask.cardtype
	setCardType(cardType)
	updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
	const ccNumber = document.querySelector(".cc-number")
	ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

//Event DateExpiration
expirationDateMasked.on("accept", () => {
	updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date) {
	const ccExpiration = document.querySelector(".cc-expiration .value")
	ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
