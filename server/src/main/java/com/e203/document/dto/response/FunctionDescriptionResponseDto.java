package com.e203.document.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FunctionDescriptionResponseDto {

	private List<String> category;
	private List<String> functionName;
	private List<String> description;
	private List<String> owner;
	private List<String> priority;


	@Builder
	private FunctionDescriptionResponseDto(List<String> category, List<String> functionName, List<String> description, List<String> owner, List<String> priority) {
		this.category = category;
		this.functionName = functionName;
		this.description = description;
		this.owner = owner;
		this.priority = priority;
	}
}
