package com.e203.global.validation;

import java.time.LocalDate;

public class Validation {

	public static boolean isValidPeriod(LocalDate startDate, LocalDate endDate) {
		if(startDate == null || endDate == null) {
			return false;
		}
		return !startDate.isAfter(endDate);
	}
}
